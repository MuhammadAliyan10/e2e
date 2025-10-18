"use client";

import { useRouter } from "next/navigation";
import {
  Workflow,
  TrendingUp,
  Download,
  Settings,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../header/PageHeader";

export function DashboardHeader() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon");
  };

  return (
    <PageHeader
      title="Dashboard"
      description="AI-powered automation analytics and performance insights"
      primaryAction={{
        label: "Create Workflow",
        icon: <Workflow className="h-4 w-4" />,
        onClick: () => router.push("/dashboard/workflows/new"),
      }}
      secondaryActions={[
        {
          label: "View Analytics",
          icon: <TrendingUp className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/analytics"),
        },
        {
          label: "Export Report",
          icon: <Download className="h-4 w-4" />,
          onClick: handleExport,
        },
        {
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/settings"),
        },
      ]}
      actions={
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh dashboard"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      }
    />
  );
}
