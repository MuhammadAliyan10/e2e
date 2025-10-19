"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { SelectNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const SelectNode = memo((props: NodeProps<SelectNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="ChevronDown"
      iconBgColor="bg-yellow-500"
      iconTextColor="text-slate-900"
      dotColor="fill-yellow-400 text-yellow-400"
      handleColor="bg-yellow-400"
    >
      {data.selector && (
        <div className="space-y-0.5">
          <div className="truncate text-[10px] opacity-70">
            Dropdown: <code>{data.selector}</code>
          </div>
          {data.value && (
            <div className="truncate">
              Select: <strong>{data.value}</strong>
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
});

SelectNode.displayName = "SelectNode";
