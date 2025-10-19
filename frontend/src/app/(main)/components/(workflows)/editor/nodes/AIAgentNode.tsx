"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Brain } from "lucide-react";
import type { AIAgentNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const AIAgentNode = memo((props: NodeProps<AIAgentNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Sparkles"
      iconBgColor="bg-purple-500"
      iconTextColor="text-white"
      dotColor="fill-purple-400 text-purple-400"
      handleColor="bg-purple-400"
    >
      {data.url && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3" />
            <span className="truncate">{new URL(data.url).hostname}</span>
          </div>
          {data.prompt && (
            <div className="truncate text-[11px] opacity-80">
              "{data.prompt.slice(0, 50)}..."
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
});

AIAgentNode.displayName = "AIAgentNode";
