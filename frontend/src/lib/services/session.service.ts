import { prisma } from "../prisma";
import { SessionStatus, AuditAction, AuditResource } from "@prisma/client";
import { logger } from "../logger";
import { parseUserAgent } from "../utils/clerk.utils";

export interface CreateSessionParams {
  userId: string;
  clerkSessionId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface SessionMetadata {
  device?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
}

export class SessionService {
  static async createSession(
    params: CreateSessionParams
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      const { userId, clerkSessionId, ipAddress, userAgent, expiresAt } =
        params;

      // Parse user agent
      const uaInfo = userAgent ? parseUserAgent(userAgent) : {};

      // Create session
      const session = await prisma.session.create({
        data: {
          userId,
          clerkSessionId,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          device: uaInfo.device || null,
          browser: uaInfo.browser || null,
          os: uaInfo.os || null,
          status: SessionStatus.ACTIVE,
          expiresAt,
          lastActiveAt: new Date(),
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: AuditAction.SESSION_CREATED,
          resource: AuditResource.SESSION,
          resourceId: session.id,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            clerkSessionId,
            device: uaInfo.device,
            browser: uaInfo.browser,
            os: uaInfo.os,
          },
        },
      });

      logger.info({
        type: "session_created",
        userId,
        sessionId: session.id,
        clerkSessionId,
      });

      return { success: true, sessionId: session.id };
    } catch (error) {
      logger.error({
        type: "create_session_failed",
        userId: params.userId,
        error,
      });

      return {
        success: false,
        error: "Failed to create session",
      };
    }
  }

  static async revokeSession(
    sessionId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const session = await prisma.session.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
        },
        include: { user: true },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: AuditAction.SESSION_REVOKED,
          resource: AuditResource.SESSION,
          resourceId: sessionId,
          metadata: {
            clerkSessionId: session.clerkSessionId,
          },
        },
      });

      logger.info({
        type: "session_revoked",
        sessionId,
        userId: session.userId,
      });

      return { success: true };
    } catch (error) {
      logger.error({
        type: "revoke_session_failed",
        sessionId,
        error,
      });

      return {
        success: false,
        error: "Failed to revoke session",
      };
    }
  }

  static async updateSessionActivity(clerkSessionId: string): Promise<void> {
    try {
      await prisma.session.update({
        where: { clerkSessionId },
        data: { lastActiveAt: new Date() },
      });
    } catch (error) {
      logger.error({
        type: "update_session_activity_failed",
        clerkSessionId,
        error,
      });
    }
  }

  static async expireOldSessions(): Promise<number> {
    try {
      const result = await prisma.session.updateMany({
        where: {
          expiresAt: { lt: new Date() },
          status: SessionStatus.ACTIVE,
        },
        data: {
          status: SessionStatus.EXPIRED,
        },
      });

      logger.info({
        type: "expired_old_sessions",
        count: result.count,
      });

      return result.count;
    } catch (error) {
      logger.error({
        type: "expire_old_sessions_failed",
        error,
      });
      return 0;
    }
  }

  static async getUserActiveSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        status: SessionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: "desc" },
      take: 10,
    });
  }
}
