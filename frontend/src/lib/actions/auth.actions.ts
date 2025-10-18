"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validators/auth.schema";
import { AuthService } from "@/lib/services/auth.service";
import { logger, logError } from "@/lib/logger";
import { AuthProvider, FailedLoginReason } from "@prisma/client";
import {
  checkRateLimit,
  authRateLimiter,
  failedLoginLimiter,
} from "@/lib/utils/rate-limit";
import { revalidatePath } from "next/cache";

type ActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  rateLimitExceeded?: boolean;
};

async function getClientInfo() {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";
  const userAgent = headersList.get("user-agent") || undefined;

  return { ipAddress, userAgent };
}

export async function signUpAction(
  input: SignUpInput
): Promise<ActionResponse<{ userId: string }>> {
  const { ipAddress, userAgent } = await getClientInfo();

  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(authRateLimiter, ipAddress);
    if (!rateLimitResult.success) {
      logger.warn({
        type: "signup_rate_limited",
        ipAddress,
        remaining: rateLimitResult.remaining,
      });

      return {
        success: false,
        message: "Too many requests. Please try again later.",
        rateLimitExceeded: true,
      };
    }

    // Validate input
    const validated = signUpSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { username, email, password } = validated.data;

    // Check if username exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return {
        success: false,
        message: "Username already taken",
        errors: { username: ["This username is already in use"] },
      };
    }

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return {
        success: false,
        message: "Email already registered",
        errors: { email: ["An account with this email already exists"] },
      };
    }

    // Create user in Clerk - FIXED: await clerkClient()
    const clerk = await clerkClient();
    let clerkUser;
    try {
      clerkUser = await clerk.users.createUser({
        username,
        emailAddress: [email],
        password,
      });
    } catch (clerkError: any) {
      logger.error({
        type: "clerk_create_user_failed",
        email,
        error: clerkError,
      });

      // Handle Clerk-specific errors
      if (clerkError.errors?.[0]?.code === "form_identifier_exists") {
        return {
          success: false,
          message: "Email already registered",
          errors: { email: ["This email is already in use"] },
        };
      }

      if (clerkError.errors?.[0]?.code === "form_password_pwned") {
        return {
          success: false,
          message: "Password compromised",
          errors: {
            password: [
              "This password has been exposed in a data breach. Please choose a different one.",
            ],
          },
        };
      }

      if (clerkError.errors?.[0]?.code === "form_username_invalid_character") {
        return {
          success: false,
          message: "Invalid username",
          errors: { username: ["Username contains invalid characters"] },
        };
      }

      return {
        success: false,
        message: "Failed to create account. Please try again.",
      };
    }

    // Create user in our database
    const result = await AuthService.createUser({
      clerkId: clerkUser.id,
      email,
      username,
      firstName: null,
      lastName: null,
      imageUrl: clerkUser.imageUrl || null,
      provider: AuthProvider.EMAIL,
    });

    if (!result.success) {
      // Rollback Clerk user if DB creation fails
      try {
        await clerk.users.deleteUser(clerkUser.id);
      } catch (rollbackError) {
        logError(rollbackError, {
          type: "clerk_rollback_failed",
          clerkId: clerkUser.id,
        });
      }

      return {
        success: false,
        message: "Failed to create account. Please try again.",
      };
    }

    logger.info({
      type: "user_signup_success",
      userId: result.user!.id,
      clerkId: clerkUser.id,
      provider: "EMAIL",
      ipAddress,
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Account created successfully",
      data: { userId: clerkUser.id },
    };
  } catch (error) {
    logError(error, {
      type: "signup_action_failed",
      email: input.email,
      ipAddress,
    });

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signInAction(
  input: SignInInput
): Promise<ActionResponse<{ userId: string }>> {
  const { ipAddress, userAgent } = await getClientInfo();

  try {
    // Rate limiting per IP
    const ipRateLimitResult = await checkRateLimit(authRateLimiter, ipAddress);
    if (!ipRateLimitResult.success) {
      logger.warn({
        type: "signin_ip_rate_limited",
        ipAddress,
        email: input.email,
      });

      return {
        success: false,
        message: "Too many requests. Please try again later.",
        rateLimitExceeded: true,
      };
    }

    // Validate input
    const validated = signInSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { email } = validated.data;

    // Check rate limit for failed logins per email
    const emailRateLimitResult = await checkRateLimit(
      failedLoginLimiter,
      email
    );
    if (!emailRateLimitResult.success) {
      await AuthService.recordLoginFailure(
        email,
        FailedLoginReason.RATE_LIMITED,
        ipAddress,
        userAgent
      );

      logger.warn({
        type: "signin_email_rate_limited",
        email,
        ipAddress,
      });

      return {
        success: false,
        message: "Too many failed attempts. Please try again in 1 minute.",
        rateLimitExceeded: true,
      };
    }

    // Check if user exists and get status
    const userCheck = await AuthService.checkUserStatus(email);

    if (!userCheck.exists) {
      await AuthService.recordLoginFailure(
        email,
        FailedLoginReason.INVALID_CREDENTIALS,
        ipAddress,
        userAgent
      );

      return {
        success: false,
        message: "Invalid credentials",
        errors: { email: ["No account found with this email"] },
      };
    }

    // Check user status
    if (userCheck.status === "SUSPENDED") {
      await AuthService.recordLoginFailure(
        email,
        FailedLoginReason.ACCOUNT_SUSPENDED,
        ipAddress,
        userAgent
      );

      return {
        success: false,
        message: "Account suspended",
        errors: {
          email: ["Your account has been suspended. Contact support."],
        },
      };
    }

    if (userCheck.status === "DELETED") {
      await AuthService.recordLoginFailure(
        email,
        FailedLoginReason.ACCOUNT_DELETED,
        ipAddress,
        userAgent
      );

      return {
        success: false,
        message: "Account not found",
        errors: {
          email: ["No account found with this email"],
        },
      };
    }

    // Record successful login
    if (userCheck.userId) {
      await AuthService.recordLoginSuccess(
        userCheck.userId,
        ipAddress,
        userAgent
      );
    }

    logger.info({
      type: "signin_action_success",
      email,
      userId: userCheck.userId,
      ipAddress,
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Signed in successfully",
      data: { userId: userCheck.userId! },
    };
  } catch (error) {
    logError(error, {
      type: "signin_action_failed",
      email: input.email,
      ipAddress,
    });

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getCurrentAuthUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await AuthService.getUserByClerkId(userId);

    if (!user || user.status !== "ACTIVE") {
      return null;
    }

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      plan: user.plan,
      status: user.status,
    };
  } catch (error) {
    logError(error, { type: "get_current_user_failed" });
    return null;
  }
}

export async function getActiveSessionsAction() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await AuthService.getUserByClerkId(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: "desc" },
      take: 10,
    });

    return {
      success: true,
      data: sessions,
    };
  } catch (error) {
    logError(error, { type: "get_active_sessions_failed" });
    return {
      success: false,
      message: "Failed to fetch sessions",
    };
  }
}
