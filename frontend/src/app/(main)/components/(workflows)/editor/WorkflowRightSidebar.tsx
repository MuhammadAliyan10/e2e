"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock integrations (expandable in future)
const INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: "MessageSquare",
    color: "#4A154B",
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    icon: "Mail",
    color: "#EA4335",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    category: "Spreadsheets",
    icon: "Table",
    color: "#34A853",
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "Database",
    icon: "Database",
    color: "#18BFFF",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    icon: "FileText",
    color: "#000000",
  },
];

export function RightSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [search, setSearch] = useState("");

  const filteredIntegrations = INTEGRATIONS.filter((integration) =>
    integration.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="w-12 border-l bg-background flex flex-col items-center py-2 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 border-l bg-background flex flex-col shrink-0">
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">Apps</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-6 w-6"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center gap-2 p-2 rounded border bg-card hover:bg-accent cursor-pointer transition-colors"
            >
              <div
                className="h-7 w-7 rounded flex items-center justify-center shrink-0 text-white font-bold text-xs"
                style={{ backgroundColor: integration.color }}
              >
                {integration.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs leading-none">
                  {integration.name}
                </p>
                <Badge variant="secondary" className="mt-1 h-4 text-[9px]">
                  {integration.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
