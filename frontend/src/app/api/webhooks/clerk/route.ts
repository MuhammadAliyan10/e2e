import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { AuthService } from "@/lib/services/auth.service";
import { SessionService } from "@/lib/services/session.service";
import { logger, logError } from "@/lib/logger";
import { extractAuthProvider } from "@/lib/utils/clerk.utils";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

if (!webhookSecret) {
  throw new Error("CLERK_WEBHOOK_SECRET is not set");
}

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.error({
      type: "webhook_missing_headers",
      headers: {
        svix_id: !!svix_id,
        svix_timestamp: !!svix_timestamp,
        svix_signature: !!svix_signature,
      },
    });

    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    logError(error, {
      type: "webhook_verification_failed",
      svix_id,
    });

    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;
  const eventId = (evt.data as any).id || "unknown";

  logger.info({
    type: "webhook_received",
    eventType,
    eventId,
  });

  try {
    switch (eventType) {
      case "user.created": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
          external_accounts,
        } = evt.data;
        const primaryEmail = email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );

        if (!primaryEmail?.email_address) {
          logger.error({
            type: "webhook_missing_email",
            eventType,
            clerkId: id,
          });
          break;
        }

        const provider = extractAuthProvider(evt.data as any);

        await AuthService.createUser({
          clerkId: id,
          email: primaryEmail.email_address,
          username: username || null,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
          provider,
        });

        logger.info({
          type: "webhook_user_created",
          clerkId: id,
          provider,
        });
        break;
      }

      case "user.updated": {
        const { id } = evt.data;
        await AuthService.syncUserFromClerk(id);

        logger.info({
          type: "webhook_user_updated",
          clerkId: id,
        });
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          logger.error({
            type: "webhook_missing_clerk_id",
            eventType,
          });
          break;
        }

        const user = await AuthService.getUserByClerkId(id);

        if (user) {
          await AuthService.softDeleteUser(user.id);

          logger.info({
            type: "webhook_user_deleted",
            clerkId: id,
            userId: user.id,
          });
        }
        break;
      }

      case "session.created": {
        const { user_id, id, client_id, expire_at } = evt.data;

        const user = await AuthService.getUserByClerkId(user_id);

        if (!user) {
          logger.warn({
            type: "webhook_session_user_not_found",
            clerkId: user_id,
          });
          break;
        }

        const expiresAt = new Date(expire_at);

        await SessionService.createSession({
          userId: user.id,
          clerkSessionId: id,
          expiresAt,
        });

        logger.info({
          type: "webhook_session_created",
          userId: user.id,
          clerkSessionId: id,
        });
        break;
      }

      case "session.ended":
      case "session.removed":
      case "session.revoked": {
        const { id } = evt.data;

        const session = await prisma.session.findUnique({
          where: { clerkSessionId: id },
        });

        if (session) {
          await SessionService.revokeSession(session.id);

          logger.info({
            type: "webhook_session_revoked",
            clerkSessionId: id,
            sessionId: session.id,
          });
        }
        break;
      }

      default:
        logger.warn({
          type: "webhook_unhandled_event",
          eventType,
          eventId,
        });
    }

    return NextResponse.json({ success: true, eventType }, { status: 200 });
  } catch (error) {
    logError(error, {
      type: "webhook_handler_error",
      eventType,
      eventId,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Import prisma here to avoid circular dependencies
import { prisma } from "@/lib/prisma";
