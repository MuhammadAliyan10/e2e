import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Providers } from "./provider/QueryProvider";

// Professional sans-serif for body text & UI
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Monospace for code & technical text
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | e2e",
    default: "e2e | Intelligent Web Automation Platform",
  },
  description:
    "Discover sites, orchestrate workflows, and automate interactions with AI-powered web orchestration. Monitor, scale, and deploy with e2e.",

  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" className="dark" suppressHydrationWarning>
          <head>
            <meta name="theme-color" content="#0f0f1e" />
          </head>
          <body
            className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
            suppressHydrationWarning
          >
            {children}
            <Toaster position="bottom-right" />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
