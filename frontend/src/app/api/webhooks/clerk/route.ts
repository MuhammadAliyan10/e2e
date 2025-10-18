import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { logger, logError } from "@/lib/logger";
import type { AuthProvider } from "@prisma/client";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

if (!webhookSecret) {
  throw new Error("CLERK_WEBHOOK_SECRET is not set");
}

/**
 * Normalize Clerk OAuth provider to Prisma enum
 */
function normalizeProvider(clerkProvider: string): AuthProvider {
  const providerMap: Record<string, AuthProvider> = {
    oauth_google: "GOOGLE",
    google: "GOOGLE",
    oauth_github: "GITHUB",
    github: "GITHUB",
    oauth_microsoft: "MICROSOFT",
    microsoft: "MICROSOFT",
    email: "EMAIL",
    password: "EMAIL",
  };

  const normalized = providerMap[clerkProvider.toLowerCase()];

  if (!normalized) {
    logger.warn({
      type: "unknown_webhook_provider",
      provider: clerkProvider,
    });
    return "EMAIL";
  }

  return normalized;
}

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
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
    logError(error, { type: "webhook_verification_failed" });
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

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
            clerkId: id,
          });
          break;
        }

        // Determine provider from external accounts
        let provider: AuthProvider = "EMAIL";
        if (external_accounts && external_accounts.length > 0) {
          provider = normalizeProvider(external_accounts[0].provider);
        }

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: primaryEmail.email_address,
            username: username || null,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            provider,
          },
          create: {
            clerkId: id,
            email: primaryEmail.email_address,
            username: username || null,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            provider,
            status: "ACTIVE",
            emailVerified: true,
          },
        });

        logger.info({
          type: "webhook_user_created",
          clerkId: id,
          provider,
        });
        break;
      }

      case "user.updated": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
        } = evt.data;

        const primaryEmail = email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );

        if (primaryEmail) {
          await prisma.user.update({
            where: { clerkId: id },
            data: {
              email: primaryEmail.email_address,
              username: username || null,
              firstName: first_name || null,
              lastName: last_name || null,
              imageUrl: image_url || null,
            },
          });

          logger.info({
            type: "webhook_user_updated",
            clerkId: id,
          });
        }
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (id) {
          const user = await prisma.user.findUnique({
            where: { clerkId: id },
            select: { id: true },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                status: "DELETED",
                deletedAt: new Date(),
              },
            });

            logger.info({
              type: "webhook_user_deleted",
              clerkId: id,
            });
          }
        }
        break;
      }

      default:
        logger.warn({
          type: "webhook_unhandled_event",
          eventType,
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logError(error, {
      type: "webhook_handler_error",
      eventType,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
