import { clerkClient } from "@clerk/nextjs/server";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { AuthProvider } from "@prisma/client";
import { logger } from "../logger";

export async function getClerkUserSafe(
  clerkId: string
): Promise<ClerkUser | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(clerkId);
    return user;
  } catch (error) {
    logger.error({
      type: "clerk_get_user_failed",
      clerkId,
      error,
    });
    return null;
  }
}
export async function deleteClerkUserSafe(clerkId: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(clerkId);
    return true;
  } catch (error) {
    logger.error({
      type: "clerk_delete_user_failed",
      clerkId,
      error,
    });
    return false;
  }
}

export function extractAuthProvider(clerkUser: ClerkUser): AuthProvider {
  const externalAccounts = clerkUser.externalAccounts || [];

  if (externalAccounts.some((acc) => acc.provider === "google")) {
    return AuthProvider.GOOGLE;
  }
  if (externalAccounts.some((acc) => acc.provider === "github")) {
    return AuthProvider.GITHUB;
  }
  if (externalAccounts.some((acc) => acc.provider === "microsoft")) {
    return AuthProvider.MICROSOFT;
  }

  return AuthProvider.EMAIL;
}

export function parseUserAgent(userAgent: string): {
  browser?: string;
  os?: string;
  device?: string;
} {
  const browsers = [
    { name: "Chrome", regex: /Chrome\/[\d.]+/ },
    { name: "Firefox", regex: /Firefox\/[\d.]+/ },
    { name: "Safari", regex: /Safari\/[\d.]+/ },
    { name: "Edge", regex: /Edg\/[\d.]+/ },
  ];

  const operatingSystems = [
    { name: "Windows", regex: /Windows NT [\d.]+/ },
    { name: "macOS", regex: /Mac OS X [\d_]+/ },
    { name: "Linux", regex: /Linux/ },
    { name: "iOS", regex: /iPhone OS [\d_]+/ },
    { name: "Android", regex: /Android [\d.]+/ },
  ];

  const browser = browsers.find((b) => b.regex.test(userAgent))?.name;
  const os = operatingSystems.find((o) => o.regex.test(userAgent))?.name;
  const device = /Mobile/.test(userAgent) ? "Mobile" : "Desktop";

  return { browser, os, device };
}
