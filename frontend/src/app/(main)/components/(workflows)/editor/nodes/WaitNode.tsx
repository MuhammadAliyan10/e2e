"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { WaitNodeData } from "@/lib/types/workflow-editor.types";
import { BaseNode } from "./BaseNode";

export const WaitNode = memo((props: NodeProps<WaitNodeData>) => {
  const { data } = props;

  const displayDuration =
    data.unit === "ms"
      ? `${data.duration}ms`
      : data.unit === "s"
      ? `${data.duration}s`
      : `${data.duration}m`;

  return (
    <BaseNode {...props} icon="Clock" color="#64748b">
      <div className="text-center">
        <p className="text-2xl font-bold">{displayDuration}</p>
        <p className="text-xs text-muted-foreground mt-1">Wait duration</p>
      </div>
    </BaseNode>
  );
});

WaitNode.displayName = "WaitNode";
