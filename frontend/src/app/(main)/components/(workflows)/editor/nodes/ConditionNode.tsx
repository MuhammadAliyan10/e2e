"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { ConditionNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const ConditionNode = memo((props: NodeProps<ConditionNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="GitBranch"
      iconBgColor="bg-pink-500"
      iconTextColor="text-white"
      dotColor="fill-pink-400 text-pink-400"
      handleColor="bg-pink-400"
    >
      {data.conditions && data.conditions.length > 0 && (
        <div className="truncate">
          {data.conditions.length} condition
          {data.conditions.length !== 1 ? "s" : ""} ({data.logic || "AND"})
        </div>
      )}
    </BaseNode>
  );
});

ConditionNode.displayName = "ConditionNode";
