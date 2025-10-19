"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { FilterNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "../BaseNode";

export const FilterNode = memo((props: NodeProps<FilterNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Filter"
      iconBgColor="bg-emerald-500"
      iconTextColor="text-white"
      dotColor="fill-emerald-400 text-emerald-400"
      handleColor="bg-emerald-400"
    >
      {data.conditions && data.conditions.length > 0 && (
        <div className="truncate">
          {data.conditions.length} filter
          {data.conditions.length !== 1 ? "s" : ""} applied
        </div>
      )}
    </BaseNode>
  );
});

FilterNode.displayName = "FilterNode";
