"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import { signInSchema, type SignInInput } from "@/lib/validators/auth.schema";
import { signInAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OAuthButtons } from "./OAuthButton";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [isPending, startTransition] = useTransition();
  const [isClerkLoading, setIsClerkLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isLoading = isPending || isClerkLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    if (!isLoaded) {
      toast.error("Authentication service not ready");
      return;
    }

    setGeneralError(null);
    setIsClerkLoading(true);

    try {
      // Step 1: Validate with server action
      const serverResult = await signInAction(data);

      if (!serverResult.success) {
        if (serverResult.rateLimitExceeded) {
          setGeneralError(serverResult.message);
          toast.error(serverResult.message);
          return;
        }

        if (serverResult.errors) {
          Object.entries(serverResult.errors).forEach(([field, messages]) => {
            setError(field as keyof SignInInput, {
              message: messages[0],
            });
          });
        } else {
          setGeneralError(serverResult.message);
        }
        return;
      }

      // Step 2: Sign in with Clerk
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        const redirectUrl = searchParams?.get("redirect") || "/home";
        const isValidRedirect =
          redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");
        const finalRedirect = isValidRedirect ? redirectUrl : "/home";

        toast.success("Welcome back!");
        router.push(finalRedirect);
        router.refresh();
      } else if (signInAttempt.status === "needs_first_factor") {
        setGeneralError("Two-factor authentication required");
        toast.error("Please complete two-factor authentication");
      } else {
        setGeneralError("Additional verification required");
        toast.error("Additional verification required");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);

      const clerkErrors = error?.errors || [];
      const firstError = clerkErrors[0];

      if (firstError?.code === "form_password_incorrect") {
        setError("password", { message: "Incorrect password" });
      } else if (firstError?.code === "form_identifier_not_found") {
        setError("email", { message: "No account found with this email" });
      } else if (firstError?.code === "too_many_attempts") {
        setGeneralError("Too many attempts. Please try again later.");
        toast.error("Too many attempts. Please try again later.");
      } else {
        setGeneralError("Failed to sign in. Please try again.");
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsClerkLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back! Please sign in to continue
        </p>
      </div>

      {generalError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Clerk CAPTCHA Container - REQUIRED */}
        <div id="clerk-captcha" className="mb-4" />

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons disabled={isLoading} />

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&lsquo;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
