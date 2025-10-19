"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NODE_DEFINITIONS } from "@/lib/utils/node-factory";
import * as Icons from "lucide-react";

export function WorkflowSidebar() {
  const [search, setSearch] = useState("");

  const categories = Array.from(
    new Set(Object.values(NODE_DEFINITIONS).map((def) => def.category))
  );

  const filteredNodes = Object.entries(NODE_DEFINITIONS).filter(
    ([_, def]) =>
      def.label.toLowerCase().includes(search.toLowerCase()) ||
      def.description.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-80 border-r bg-background flex flex-col shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Node Palette</h2>
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

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="all" className="p-4 space-y-2 mt-0">
            {filteredNodes.map(([type, def]) => {
              const IconComponent =
                Icons[def.icon as keyof typeof Icons] || Icons.HelpCircle;

              return (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => onDragStart(e, type)}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-move transition-colors group"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${def.color}20`,
                      color: def.color,
                    }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{def.label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {def.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="p-4 space-y-2 mt-0"
            >
              {Object.entries(NODE_DEFINITIONS)
                .filter(([_, def]) => def.category === category)
                .map(([type, def]) => {
                  const IconComponent =
                    Icons[def.icon as keyof typeof Icons] || Icons.HelpCircle;

                  return (
                    <div
                      key={type}
                      draggable
                      onDragStart={(e) => onDragStart(e, type)}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-move transition-colors"
                    >
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${def.color}20`,
                          color: def.color,
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{def.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {def.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
