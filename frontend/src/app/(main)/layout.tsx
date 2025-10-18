import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "./components/sidebar/Sidebar";
import { DashboardLayoutWrapper } from "./components/layout/DashboardLayoutWrapper";
import { Navbar } from "./components/navbar/Navbar";

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
      <DashboardLayoutWrapper>
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 px-4 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </DashboardLayoutWrapper>
    </div>
  );
}
