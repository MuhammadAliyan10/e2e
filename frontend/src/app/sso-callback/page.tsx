"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    const complete = async () => {
      try {
        await handleRedirectCallback({});
      } catch (error) {
        console.error("SSO callback error:", error);
        window.location.href = "/login?error=sso_failed";
      }
    };

    complete();
  }, [handleRedirectCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Completing sign in...</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we redirect you
          </p>
        </div>
      </div>
    </div>
  );
}
