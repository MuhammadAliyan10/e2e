"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function OverviewHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between  px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All the workflows, credentials and data tables you have access to
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-none">
            Create Workflow
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-transparent border border-muted-foreground"
        >
          <DropdownMenuItem onClick={() => router.push("/workflows/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Blank workflow
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/templates")}>
            <Plus className="mr-2 h-4 w-4" />
            From template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
