"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronRight, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  getAllCategories,
  searchNodes,
  type NodeCategory,
  getNodesByCategory,
} from "@/lib/utils/node-registry";
import { getNodeIcon } from "@/lib/utils/get-node-icon";
import type { NodeType } from "@/lib/types/workflow-nodes.types";
import { cn } from "@/lib/utils";

interface AddNodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNode: (nodeType: NodeType) => void;
}

// Category metadata with icons and descriptions
const CATEGORY_META: Record<
  NodeCategory,
  { icon: string; description: string }
> = {
  AI: {
    icon: "Bot",
    description: "Build autonomous agents, summarize or search documents, etc.",
  },
  "Web Automation": {
    icon: "Globe",
    description: "Interact with websites, extract data, automate browsing",
  },
  Communication: {
    icon: "Mail",
    description: "Send emails, messages, and notifications",
  },
  "Social Media": {
    icon: "Share2",
    description: "Post and interact with social platforms",
  },
  Productivity: {
    icon: "FileText",
    description:
      "Do something in an app or service like Google Sheets, Telegram or Notion",
  },
  "File Management": {
    icon: "Folder",
    description: "Upload, download, and manage files",
  },
  "Developer Tools": {
    icon: "Code",
    description: "Version control, issue tracking, and development workflows",
  },
  "E-commerce": {
    icon: "ShoppingCart",
    description: "Manage products, orders, and payments",
  },
  Databases: { icon: "Database", description: "Query and update databases" },
  "Cloud & Infra": {
    icon: "Cloud",
    description: "Deploy and manage cloud resources",
  },
  "Control Flow": {
    icon: "GitBranch",
    description: "Branch, merge or loop the flow, etc.",
  },
  Scheduling: { icon: "Calendar", description: "Schedule workflow execution" },
  "Event-Based": {
    icon: "Zap",
    description:
      "Triggers start your workflow. Workflows can have multiple triggers.",
  },
  "Data Processing": {
    icon: "Edit3",
    description: "Manipulate, filter or convert data",
  },
  Utility: {
    icon: "Briefcase",
    description: "Run code, make HTTP requests, set webhooks, etc.",
  },
  "User Management": {
    icon: "Users",
    description: "Manage users, authentication, and access",
  },
  "System Control": {
    icon: "Settings",
    description: "Control system resources and containers",
  },
  Security: {
    icon: "Shield",
    description: "Encrypt, validate, and secure data",
  },
  General: {
    icon: "Package",
    description: "Wait for approval or human input before continuing",
  },
};

export function AddNodeSheet({
  open,
  onOpenChange,
  onSelectNode,
}: AddNodeSheetProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory | null>(
    null
  );

  const CATEGORIES = getAllCategories();

  // Filter categories or nodes based on search
  const filteredContent = useMemo(() => {
    if (!search) {
      return { type: "categories" as const, categories: CATEGORIES };
    }

    const nodes = searchNodes(search);
    return { type: "nodes" as const, nodes };
  }, [search, CATEGORIES]);

  // Get nodes for selected category
  const categoryNodes = useMemo(() => {
    if (!selectedCategory) return [];
    return getNodesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSelectNode = (nodeType: NodeType) => {
    onSelectNode(nodeType);
    setSearch("");
    setSelectedCategory(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const getCategoryIcon = (category: NodeCategory) => {
    const iconName = CATEGORY_META[category]?.icon || "Package";
    const Icon = getNodeIcon(iconName);
    return Icon;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTitle></SheetTitle>
      <SheetContent
        side="right"
        className="w-[520px] p-0 flex flex-col bg-[#3a3a3a] border-l border-[#4a4a4a] overflow-hidden"
      >
        {/* Header */}
        <div
          className={cn(
            " pt-4 pb-4 space-y-1 shrink-0",
            selectedCategory ? "px-1" : "px-4"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={handleBack}
                className="h-8 w-8 rounded-md hover:bg-[#4a4a4a] flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-300" />
              </button>
            )}
            <div className="flex-1">
              <h2 className="text-[20px] font-semibold text-white leading-tight">
                {selectedCategory || "What happens next?"}
              </h2>
              {selectedCategory && (
                <p className="text-[12px] text-muted-foreground leading-snug mt-1">
                  {CATEGORY_META[selectedCategory]?.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4 shrink-0 border-b border-[#3a3a3a] ">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-12 h-12 rounded-sm text-[12px] bg-[#2a2a2a] border-1 border-[#5865f2]  focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#4a4a4a] rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-4">
          {/* Show Categories */}
          {!selectedCategory && filteredContent.type === "categories" && (
            <div className="space-y-0">
              {filteredContent.categories.map((category, index) => {
                const Icon = getCategoryIcon(category);
                const meta = CATEGORY_META[category];
                const isFirst = index === 0;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4  relative",
                      "hover:bg-[#4a4a4a] transition-all duration-150",
                      "text-left group"
                    )}
                  >
                    {/* Left border for first item */}
                    {isFirst && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                    )}

                    <Icon className="h-6 w-6 text-gray-300 shrink-0" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white mb-1 leading-tight">
                        {category}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                        {meta?.description || ""}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <ChevronRight className="h-5 w-5 text-gray-500 transition-opacity shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Show Nodes for Selected Category */}
          {selectedCategory && (
            <div className="space-y-0">
              {categoryNodes.map((node) => {
                const Icon = getNodeIcon(node.icon);
                return (
                  <button
                    key={node.type}
                    onClick={() => handleSelectNode(node.type)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4  relative",
                      "hover:bg-[#4a4a4a] transition-all duration-150",
                      "text-left group"
                    )}
                  >
                    <Icon className="h-6 w-6 text-gray-300 shrink-0" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white mb-1 leading-tight">
                        {node.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                        {node.description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {categoryNodes.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[15px] text-gray-400">
                    No nodes in this category yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Show Search Results */}
          {filteredContent.type === "nodes" && (
            <div className="space-y-0">
              {filteredContent.nodes.map((node) => {
                const Icon = getNodeIcon(node.icon);
                return (
                  <button
                    key={node.type}
                    onClick={() => handleSelectNode(node.type)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4  relative",
                      "hover:bg-[#4a4a4a] transition-all duration-150",
                      "text-left group"
                    )}
                  >
                    <Icon className="h-6 w-6 text-gray-300" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white mb-1 leading-tight">
                        {node.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                        {node.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <ChevronRight className="h-5 w-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                );
              })}

              {filteredContent.nodes.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a] mb-4 border border-[#4a4a4a]">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-[15px] font-medium mb-2 text-white">
                    No nodes found
                  </h3>
                  <p className="text-[13px] text-gray-400 mb-4">
                    Try adjusting your search
                  </p>
                  <button
                    onClick={() => setSearch("")}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-sm text-[13px] font-medium transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
