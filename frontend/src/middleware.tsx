import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/api/webhooks(.*)",
  "/api/health",
  "/api/public(.*)",
  "/sso-callback(.*)",
]);

const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);

export default clerkMiddleware(
  async (auth, req: NextRequest): Promise<NextResponse> => {
    const { userId } = await auth();
    const { nextUrl } = req;

    // Suppress Clerk CAPTCHA warnings in development
    if (process.env.NODE_ENV === "development") {
      const response = NextResponse.next();
      response.headers.set("X-Clerk-Skip-Bot-Protection", "true");
      return response;
    }

    if (userId && isAuthRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    if (!isPublicRoute(req) && !userId) {
      const loginUrl = new URL("/login", req.url);

      if (nextUrl.pathname !== "/") {
        loginUrl.searchParams.set("redirect", nextUrl.pathname);
      }

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
