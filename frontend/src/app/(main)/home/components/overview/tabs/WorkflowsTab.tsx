"use client";

import { FileText, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface WorkflowsTabProps {
  userName: string;
}

export function WorkflowsTab({ userName }: WorkflowsTabProps) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 pb-20">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-medium text-foreground">
          👋 Welcome {userName}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Create your first workflow
        </p>
      </div>

      <div className="flex gap-4">
        <Card
          onClick={() => router.push("/workflows/new")}
          className="group flex h-64 w-56 cursor-pointer flex-col items-center justify-center gap-4 border-border/50 bg-[#2a2a2a] transition-all hover:border-primary hover:bg-[#2f2f2f]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/10">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-sm font-medium text-foreground">
            Start from scratch
          </p>
        </Card>

        <Card
          onClick={() => router.push("/dashboard/workflows/ai-example")}
          className="group flex h-64 w-56 cursor-pointer flex-col items-center justify-center gap-4 border-border/50 bg-[#2a2a2a] transition-all hover:border-primary/50 hover:bg-[#2f2f2f]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/10">
            <Bot className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-sm font-medium text-foreground">
            Test a simple AI
            <br />
            Agent example
          </p>
        </Card>
      </div>
    </div>
  );
}
