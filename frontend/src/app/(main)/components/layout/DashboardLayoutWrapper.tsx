"use client";

import { ReactNode } from "react";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

export function DashboardLayoutWrapper({
  children,
}: DashboardLayoutWrapperProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        isOpen ? "lg:ml-64" : "lg:ml-16"
      )}
    >
      {children}
    </div>
  );
}
