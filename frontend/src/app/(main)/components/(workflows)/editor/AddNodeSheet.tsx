"use client";

import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  NODE_REGISTRY,
  getAllCategories,
  searchNodes,
  type NodeCategory,
  EDGE_COLOR,
  NODE_BG_COLOR,
} from "@/lib/utils/node-registry";
import { getNodeIcon } from "@/lib/utils/get-node-icon";
import type { NodeType } from "@/lib/types/workflow-nodes.types";
import { cn } from "@/lib/utils";

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
  const [selectedCategories, setSelectedCategories] = useState<NodeCategory[]>(
    getAllCategories()
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const CATEGORIES = getAllCategories();

  // Group and filter nodes
  const filteredCategories = useMemo(() => {
    const grouped = new Map<
      NodeCategory,
      (typeof NODE_REGISTRY)[keyof typeof NODE_REGISTRY][]
    >();

    // Use search if query exists
    const nodesToFilter = search
      ? searchNodes(search)
      : Object.values(NODE_REGISTRY);

    nodesToFilter.forEach((node) => {
      const category = node.category;
      if (!selectedCategories.includes(category)) return;

      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(node);
    });

    // Sort nodes alphabetically within each category
    grouped.forEach((nodes) => {
      nodes.sort((a, b) => a.label.localeCompare(b.label));
    });

    return grouped;
  }, [search, selectedCategories]);

  const toggleCategory = (category: NodeCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories([...CATEGORIES]);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const handleSelect = (nodeType: NodeType) => {
    onSelectNode(nodeType);
    setSearch("");
    onOpenChange(false);
  };

  const totalNodes = useMemo(() => {
    let count = 0;
    filteredCategories.forEach((nodes) => {
      count += nodes.length;
    });
    return count;
  }, [filteredCategories]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[480px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-lg font-semibold">Add Node</SheetTitle>
        </SheetHeader>

        {/* Search & Filter Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex gap-3">
            {/* Search - 80% */}
            <div className="flex-[0.8] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 h-10"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-md transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter - 20% */}
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-[0.2] h-10 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {selectedCategories.length < CATEGORIES.length && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {selectedCategories.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[280px] p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Categories</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        className="h-7 text-xs"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="h-7 text-xs"
                      >
                        None
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-3">
                      {CATEGORIES.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label
                            htmlFor={category}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {category}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {
                              Object.values(NODE_REGISTRY).filter(
                                (n) => n.category === category
                              ).length
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Results count */}
          <div className="mt-3 text-xs text-muted-foreground">
            {totalNodes} node{totalNodes !== 1 ? "s" : ""} available
          </div>
        </div>

        {/* Node List */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            {Array.from(filteredCategories.entries()).map(
              ([category, nodes]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {nodes.map((node) => {
                      const Icon = getNodeIcon(node.icon);
                      return (
                        <button
                          key={node.type}
                          onClick={() => handleSelect(node.type)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg",
                            "hover:bg-accent transition-all duration-200",
                            "border border-transparent hover:border-border",
                            "text-left group"
                          )}
                        >
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: NODE_BG_COLOR,
                              border: `2px solid ${EDGE_COLOR}`,
                            }}
                          >
                            <Icon
                              className="h-5 w-5"
                              style={{ color: EDGE_COLOR }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight mb-1">
                              {node.label}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {node.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {filteredCategories.size === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-2">No nodes found</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Try adjusting your search or filter settings
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    handleSelectAll();
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
