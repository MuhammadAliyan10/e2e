"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Globe, Zap, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    title: "Create Workflow",
    description: "Build a new automation",
    icon: Workflow,
    href: "/dashboard/workflows/new",
    color: "text-blue-500",
  },
  {
    title: "Discover Site",
    description: "Analyze a new website",
    icon: Globe,
    href: "/dashboard/sites/discover",
    color: "text-green-500",
  },
  {
    title: "Run Workflow",
    description: "Execute existing workflow",
    icon: Zap,
    href: "/dashboard/workflows",
    color: "text-yellow-500",
  },
  {
    title: "View Docs",
    description: "Learn automation tips",
    icon: BookOpen,
    href: "/docs",
    color: "text-purple-500",
  },
];

export function QuickActionsCard() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => router.push(action.href)}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left group"
              >
                <div
                  className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
