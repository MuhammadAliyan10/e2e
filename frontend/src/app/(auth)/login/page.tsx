import type { Metadata } from "next";
import { SignInForm } from "../components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your e2e account to access AI-powered web automation",
};

export default function LoginPage() {
  return <SignInForm />;
}
