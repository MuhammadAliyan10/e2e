"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NODE_REGISTRY, getNodesByCategory } from "@/lib/utils/node-registry";
import type { NodeType } from "@/lib/types/workflow-nodes.types";
import * as Icons from "lucide-react";

interface AddNodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNode: (nodeType: NodeType) => void;
}

export function AddNodeSheet({
  open,
  onOpenChange,
  onSelectNode,
}: AddNodeSheetProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ai");

  const categories = [
    { value: "ai", label: "AI", icon: "Sparkles" },
    { value: "browser", label: "Browser", icon: "Globe" },
    { value: "logic", label: "Logic", icon: "GitBranch" },
    { value: "data", label: "Data", icon: "Database" },
    { value: "integration", label: "Integration", icon: "Plug" },
  ] as const;

  const filteredNodes = Object.values(NODE_REGISTRY).filter(
    (node) =>
      node.type !== "trigger" &&
      (node.label.toLowerCase().includes(search.toLowerCase()) ||
        node.description.toLowerCase().includes(search.toLowerCase()) ||
        node.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectNode = (nodeType: NodeType) => {
    onSelectNode(nodeType);
    setSearch("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose a node to add to your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
            {categories.map((cat) => {
              const Icon =
                Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
              return (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="gap-2 text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-280px)]">
            {search ? (
              <div className="p-4 space-y-2">
                {filteredNodes.map((node) => {
                  const IconComponent =
                    Icons[node.icon as keyof typeof Icons] || Icons.HelpCircle;

                  return (
                    <button
                      key={node.type}
                      onClick={() => handleSelectNode(node.type)}
                      className="w-full flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left group"
                    >
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${node.color}15`,
                          color: node.color,
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{node.label}</p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4"
                          >
                            {node.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {node.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
                {filteredNodes.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-12">
                    No nodes found for "{search}"
                  </p>
                )}
              </div>
            ) : (
              categories.map((cat) => (
                <TabsContent
                  key={cat.value}
                  value={cat.value}
                  className="p-4 space-y-2"
                >
                  {getNodesByCategory(cat.value).map((node) => {
                    const IconComponent =
                      Icons[node.icon as keyof typeof Icons] ||
                      Icons.HelpCircle;

                    return (
                      <button
                        key={node.type}
                        onClick={() => handleSelectNode(node.type)}
                        className="w-full flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${node.color}15`,
                            color: node.color,
                          }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm mb-1">
                            {node.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {node.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </TabsContent>
              ))
            )}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
