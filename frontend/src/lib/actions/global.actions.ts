"use server";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { logError, logger } from "@/lib/logger";
import type { AuthProvider } from "@prisma/client";

/**
 * Normalize Clerk OAuth provider string to Prisma AuthProvider enum
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
      type: "unknown_provider",
      provider: clerkProvider,
      fallback: "EMAIL",
    });
    return "EMAIL";
  }

  return normalized;
}

/**
 * Get or create current user from Clerk session
 * Implements lazy user creation pattern
 */
export const getCurrentUser = cache(async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn({ type: "no_clerk_session" });
      return null;
    }

    const cacheKey = `user:${userId}`;

    // Try Redis cache first
    if (redis.isAvailable()) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Fetch from DB
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        role: true,
        plan: true,
        status: true,
        createdAt: true,
      },
    });

    // Lazy user creation: if user doesn't exist, create from Clerk data
    if (!user) {
      logger.info({ type: "lazy_user_creation", clerkId: userId });

      const { clerkClient } = await import("@clerk/nextjs/server");
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);

      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      );

      if (!primaryEmail) {
        logger.error({ type: "no_primary_email", clerkId: userId });
        return null;
      }

      // Determine auth provider from external accounts
      let provider: AuthProvider = "EMAIL";

      if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
        const externalProvider = clerkUser.externalAccounts[0].provider;
        provider = normalizeProvider(externalProvider);

        logger.info({
          type: "provider_detected",
          clerkProvider: externalProvider,
          normalizedProvider: provider,
        });
      }

      // Create user record
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: primaryEmail.emailAddress,
          username: clerkUser.username,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          provider,
          status: "ACTIVE",
          emailVerified: true,
        },
        select: {
          id: true,
          clerkId: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
          plan: true,
          status: true,
          createdAt: true,
        },
      });

      logger.info({
        type: "user_created_lazily",
        userId: user.id,
        clerkId: userId,
        provider,
      });
    }

    // Cache for 5 minutes if Redis is available
    if (redis.isAvailable()) {
      await redis.set(cacheKey, JSON.stringify(user), "EX", 300);
    }

    return user;
  } catch (error) {
    logError(error, { type: "get_current_user_failed" });
    return null;
  }
});

/**
 * Get dashboard statistics with proper error handling
 */
export async function getDashboardStats() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logger.warn({ type: "dashboard_stats_no_user" });
      return {
        success: false,
        error: "Please sign in to view dashboard",
      };
    }

    const cacheKey = `dashboard:stats:${user.id}`;

    // Try Redis cache first
    if (redis.isAvailable()) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug({ type: "cache_hit", key: cacheKey });
        return { success: true, data: JSON.parse(cached) };
      }
    }

    // Fetch stats in parallel with error boundaries
    const [
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      todayExecutions,
      successfulExecutions,
      totalSites,
    ] = await Promise.allSettled([
      prisma.workflow.count({
        where: { userId: user.id },
      }),
      prisma.workflow.count({
        where: {
          userId: user.id,
          status: "PUBLISHED",
        },
      }),
      prisma.execution.count({
        where: { userId: user.id },
      }),
      prisma.execution.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.execution.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
      prisma.discoveredSite.count({
        where: { userId: user.id },
      }),
    ]);

    // Extract values or default to 0
    const getValue = (result: PromiseSettledResult<number>) =>
      result.status === "fulfilled" ? result.value : 0;

    const workflowTotal = getValue(totalWorkflows);
    const workflowActive = getValue(activeWorkflows);
    const executionTotal = getValue(totalExecutions);
    const executionToday = getValue(todayExecutions);
    const executionSuccessful = getValue(successfulExecutions);
    const siteTotal = getValue(totalSites);

    const successRate =
      executionTotal > 0
        ? ((executionSuccessful / executionTotal) * 100).toFixed(1)
        : "0.0";

    const stats = {
      workflows: {
        total: workflowTotal,
        active: workflowActive,
        draft: workflowTotal - workflowActive,
      },
      executions: {
        total: executionTotal,
        today: executionToday,
        successful: executionSuccessful,
        successRate: `${successRate}%`,
      },
      sites: {
        total: siteTotal,
      },
    };

    // Cache for 2 minutes if Redis is available
    if (redis.isAvailable()) {
      await redis.set(cacheKey, JSON.stringify(stats), "EX", 120);
    }

    logger.info({
      type: "dashboard_stats_loaded",
      userId: user.id,
      stats,
    });

    return { success: true, data: stats };
  } catch (error) {
    logError(error, { type: "get_dashboard_stats_failed" });
    return {
      success: false,
      error: "Failed to load dashboard statistics. Please refresh the page.",
    };
  }
}

/**
 * Get recent activity with error handling
 */
export async function getRecentActivity(limit: number = 10) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const recentExecutions = await prisma.execution.findMany({
      where: { userId: user.id },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, data: recentExecutions };
  } catch (error) {
    logError(error, { type: "get_recent_activity_failed" });
    return {
      success: false,
      error: "Failed to fetch recent activity",
      data: [],
    };
  }
}

/**
 * Invalidate user cache (call after profile updates)
 */
export async function invalidateUserCache(userId: string) {
  try {
    if (redis.isAvailable()) {
      await redis.del(`user:${userId}`);
      await redis.del(`dashboard:stats:${userId}`);
    }
  } catch (error) {
    logError(error, { type: "invalidate_cache_failed", userId });
  }
}
