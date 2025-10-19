"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { MergeNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "../BaseNode";

export const MergeNode = memo((props: NodeProps<MergeNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Merge"
      iconBgColor="bg-violet-500"
      iconTextColor="text-white"
      dotColor="fill-violet-400 text-violet-400"
      handleColor="bg-violet-400"
    >
      {data.mode && (
        <div className="truncate capitalize">
          Mode: <strong>{data.mode}</strong>
        </div>
      )}
    </BaseNode>
  );
});

MergeNode.displayName = "MergeNode";
