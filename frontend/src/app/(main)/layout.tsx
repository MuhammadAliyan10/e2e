import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "./components/sidebar/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto !bg-[#2E2E2E] ">
        <div>{children}</div>
      </main>
    </div>
  );
}
