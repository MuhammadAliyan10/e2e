import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthErrorBoundary } from "./components/auth/auth-error-boundary";

export const metadata: Metadata = {
  title: {
    template: "%s | e2e Auth",
    default: "Authentication | e2e",
  },
  description: "Sign in or create an account for e2e",
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { userId } = await auth();

  // Server-side session check
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30 p-4">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              e2e
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Intelligent Web Automation Platform
            </p>
          </div>

          {children}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground space-y-2">
            <p>Protected by enterprise-grade security</p>
            <p>
              <a href="/privacy" className="hover:text-primary underline">
                Privacy
              </a>
              {" · "}
              <a href="/terms" className="hover:text-primary underline">
                Terms
              </a>
              {" · "}
              <a href="/security" className="hover:text-primary underline">
                Security
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
