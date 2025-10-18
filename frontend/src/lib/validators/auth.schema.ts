import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim()
    .max(255, "Email is too long"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const signUpSchema = z
  .object({
    username: z
      .string({ message: "Username is required" })
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-z0-9_-]+$/,
        "Username can only contain lowercase letters, numbers, hyphens, and underscores"
      )
      .trim()
      .refine(
        (val) => !["admin", "root", "system", "api"].includes(val),
        "This username is reserved"
      ),
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address")
      .toLowerCase()
      .trim()
      .max(255, "Email is too long")
      .refine(
        (email) => {
          const disposableDomains = ["tempmail.com", "throwaway.email"];
          const domain = email.split("@")[1];
          return !disposableDomains.includes(domain);
        },
        { message: "Disposable email addresses are not allowed" }
      ),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character"
      )
      .refine(
        (password) => {
          const commonPasswords = ["Password123!", "Admin123!", "Welcome123!"];
          return !commonPasswords.includes(password);
        },
        { message: "This password is too common" }
      ),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
