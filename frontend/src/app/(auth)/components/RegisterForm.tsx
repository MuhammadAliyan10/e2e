"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { signUpSchema, type SignUpInput } from "@/lib/validators/auth.schema";
import { signUpAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OAuthButtons } from "./OAuthButton";

export function SignUpForm() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [isPending, startTransition] = useTransition();
  const [isClerkLoading, setIsClerkLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isLoading = isPending || isClerkLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (
    pwd: string
  ): {
    score: number;
    label: string;
    color: string;
  } => {
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    const strength = [
      { score: 0, label: "Very Weak", color: "bg-red-500" },
      { score: 1, label: "Weak", color: "bg-orange-500" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-blue-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
      { score: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return strength[score];
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignUpInput) => {
    if (!isLoaded) {
      toast.error("Authentication service not ready");
      return;
    }

    setGeneralError(null);
    setIsClerkLoading(true);

    try {
      // Step 1: Create user via server action (validates, creates in DB + Clerk)
      const serverResult = await signUpAction(data);

      if (!serverResult.success) {
        if (serverResult.rateLimitExceeded) {
          setGeneralError(serverResult.message);
          toast.error(serverResult.message);
          return;
        }

        // Set field-specific errors
        if (serverResult.errors) {
          Object.entries(serverResult.errors).forEach(([field, messages]) => {
            setError(field as keyof SignUpInput, {
              message: messages[0],
            });
          });
        } else {
          setGeneralError(serverResult.message);
        }
        return;
      }

      // Step 2: Sign in the newly created user
      const signUpAttempt = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });

      // Handle email verification flow
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        toast.success("Account created successfully!");
        router.push("/home");
        router.refresh();
      } else if (signUpAttempt.status === "missing_requirements") {
        // Email verification required
        toast.info("Please verify your email to continue");
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.info("Please complete the signup process");
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);

      // Handle Clerk-specific errors
      const clerkErrors = error?.errors || [];
      const firstError = clerkErrors[0];

      if (firstError?.code === "form_identifier_exists") {
        setError("email", {
          message: "Email already registered",
        });
      } else if (firstError?.code === "form_username_exists") {
        setError("username", {
          message: "Username already taken",
        });
      } else if (firstError?.code === "form_password_pwned") {
        setError("password", {
          message: "This password has been exposed in a data breach",
        });
      } else if (firstError?.code === "form_param_format_invalid") {
        setGeneralError("Invalid input format. Please check your entries.");
      } else {
        setGeneralError("Failed to create account. Please try again.");
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsClerkLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Get started with e2e in seconds
        </p>
      </div>

      {generalError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            autoComplete="username"
            disabled={isLoading}
            {...register("username")}
            className={errors.username ? "border-destructive" : ""}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p
              id="username-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.username.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Lowercase letters, numbers, hyphens, and underscores only
          </p>
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={
                errors.password ? "password-error" : "password-strength"
              }
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
          {password && !errors.password && (
            <div id="password-strength" className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground min-w-[80px]">
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
              className={
                errors.confirmPassword ? "border-destructive pr-10" : "pr-10"
              }
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
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
              Creating account...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Account
            </>
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

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
