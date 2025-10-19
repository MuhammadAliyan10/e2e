"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Badge } from "@/components/ui/badge";
import type { ApiCallNodeData } from "@/lib/types/workflow-editor.types";
import { BaseNode } from "./BaseNode";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  POST: "bg-green-500/10 text-green-500 border-green-500/20",
  PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  PATCH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const ApiCallNode = memo((props: NodeProps<ApiCallNodeData>) => {
  const { data } = props;

  return (
    <BaseNode {...props} icon="Globe" color="#6366f1">
      <div className="space-y-2">
        <Badge
          variant="outline"
          className={`text-[10px] h-5 ${METHOD_COLORS[data.method]}`}
        >
          {data.method}
        </Badge>
        <div className="text-xs">
          <code className="bg-muted px-1 py-0.5 rounded text-[10px] block truncate">
            {data.url || "Not set"}
          </code>
        </div>
        {data.auth && data.auth.type !== "none" && (
          <Badge variant="secondary" className="text-[10px] h-5">
            Auth: {data.auth.type}
          </Badge>
        )}
      </div>
    </BaseNode>
  );
});

ApiCallNode.displayName = "ApiCallNode";
