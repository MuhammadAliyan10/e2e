import type { Metadata } from "next";
import { SignUpForm } from "../components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new e2e account and start automating web workflows",
};

export default function RegisterPage() {
  return <SignUpForm />;
}
