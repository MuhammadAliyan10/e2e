import { prisma } from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";
import {
  UserStatus,
  AuthProvider,
  AuditAction,
  AuditResource,
  FailedLoginReason,
} from "@prisma/client";
import { logger, logError } from "../logger";
import { extractAuthProvider } from "../utils/clerk.utils";

export interface CreateUserParams {
  clerkId: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  provider: AuthProvider;
}

export class AuthService {
  static async createUser(params: CreateUserParams) {
    try {
      const user = await prisma.user.create({
        data: {
          clerkId: params.clerkId,
          email: params.email,
          username: params.username,
          firstName: params.firstName,
          lastName: params.lastName,
          imageUrl: params.imageUrl,
          provider: params.provider,
          status: UserStatus.ACTIVE,
          emailVerified: false,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.USER_CREATED,
          resource: AuditResource.USER,
          resourceId: user.id,
          metadata: {
            provider: params.provider,
            email: params.email,
          },
        },
      });

      logger.info({
        type: "user_created",
        userId: user.id,
        clerkId: params.clerkId,
        provider: params.provider,
      });

      return { success: true, user };
    } catch (error) {
      logError(error, {
        type: "create_user_failed",
        clerkId: params.clerkId,
        email: params.email,
      });

      return {
        success: false,
        error: "Failed to create user",
      };
    }
  }

  static async getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
      include: {
        sessions: {
          where: { status: "ACTIVE" },
          orderBy: { lastActiveAt: "desc" },
          take: 5,
        },
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async checkUserStatus(email: string): Promise<{
    exists: boolean;
    status?: UserStatus;
    userId?: string;
    error?: string;
  }> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        return { exists: false };
      }

      return {
        exists: true,
        status: user.status,
        userId: user.id,
      };
    } catch (error) {
      logError(error, {
        type: "check_user_status_failed",
        email,
      });

      return {
        exists: false,
        error: "Failed to check user status",
      };
    }
  }

  static async recordLoginSuccess(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress || null,
          },
        }),
        prisma.auditLog.create({
          data: {
            userId,
            action: AuditAction.LOGIN_SUCCESS,
            resource: AuditResource.AUTH,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
          },
        }),
      ]);

      logger.info({
        type: "login_success",
        userId,
        ipAddress,
      });
    } catch (error) {
      logError(error, {
        type: "record_login_success_failed",
        userId,
      });
    }
  }

  static async recordLoginFailure(
    email: string,
    reason: FailedLoginReason,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);

      await prisma.$transaction([
        prisma.failedLogin.create({
          data: {
            userId: user?.id || null,
            email,
            ipAddress: ipAddress || "unknown",
            userAgent: userAgent || null,
            reason,
            metadata: {
              timestamp: new Date().toISOString(),
            },
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: user?.id || null,
            action: AuditAction.LOGIN_FAILED,
            resource: AuditResource.AUTH,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            metadata: {
              email,
              reason,
            },
          },
        }),
      ]);

      logger.warn({
        type: "login_failed",
        email,
        reason,
        ipAddress,
      });
    } catch (error) {
      logError(error, {
        type: "record_login_failure_failed",
        email,
      });
    }
  }

  static async getRecentFailedLogins(email: string, minutes: number = 15) {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return prisma.failedLogin.findMany({
      where: {
        email,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async softDeleteUser(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return false;

      await prisma.$transaction([
        prisma.session.updateMany({
          where: { userId },
          data: {
            status: "REVOKED",
            revokedAt: new Date(),
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            status: UserStatus.DELETED,
            deletedAt: new Date(),
            email: `deleted_${userId}@horizen.local`,
            username: null,
            mfaSecret: null,
          },
        }),
        prisma.auditLog.create({
          data: {
            userId,
            action: AuditAction.USER_DELETED,
            resource: AuditResource.USER,
            resourceId: userId,
          },
        }),
      ]);

      logger.info({
        type: "user_soft_deleted",
        userId,
        clerkId: user.clerkId,
      });

      return true;
    } catch (error) {
      logError(error, {
        type: "soft_delete_user_failed",
        userId,
      });
      return false;
    }
  }

  static async syncUserFromClerk(clerkId: string): Promise<void> {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(clerkId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      );

      const provider = extractAuthProvider(clerkUser);

      await prisma.user.upsert({
        where: { clerkId },
        update: {
          email: primaryEmail?.emailAddress || "",
          username: clerkUser.username || null,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          imageUrl: clerkUser.imageUrl || null,
          provider,
          updatedAt: new Date(),
        },
        create: {
          clerkId,
          email: primaryEmail?.emailAddress || "",
          username: clerkUser.username || null,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          imageUrl: clerkUser.imageUrl || null,
          provider,
          status: UserStatus.ACTIVE,
        },
      });

      logger.info({
        type: "user_synced_from_clerk",
        clerkId,
      });
    } catch (error) {
      logError(error, {
        type: "sync_user_from_clerk_failed",
        clerkId,
      });
    }
  }
}
