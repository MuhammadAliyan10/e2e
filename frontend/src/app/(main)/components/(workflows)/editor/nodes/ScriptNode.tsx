"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Badge } from "@/components/ui/badge";
import type { ScriptNodeData } from "@/lib/types/workflow-editor.types";
import { BaseNode } from "./BaseNode";

export const ScriptNode = memo((props: NodeProps<ScriptNodeData>) => {
  const { data } = props;

  const lineCount = data.code.split("\n").length;

  return (
    <BaseNode {...props} icon="Code" color="#f97316">
      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px] h-5">
          {data.language === "javascript" ? "JavaScript" : "Python"}
        </Badge>
        <div className="text-xs text-muted-foreground">
          {lineCount} {lineCount === 1 ? "line" : "lines"} of code
        </div>
        {data.timeout && (
          <Badge variant="secondary" className="text-[10px] h-5">
            {data.timeout}ms timeout
          </Badge>
        )}
      </div>
    </BaseNode>
  );
});

ScriptNode.displayName = "ScriptNode";
