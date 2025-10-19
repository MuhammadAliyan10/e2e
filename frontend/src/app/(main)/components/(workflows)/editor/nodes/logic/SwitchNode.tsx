"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { SwitchNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "../BaseNode";

export const SwitchNode = memo((props: NodeProps<SwitchNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="LayoutGrid"
      iconBgColor="bg-fuchsia-500"
      iconTextColor="text-white"
      dotColor="fill-fuchsia-400 text-fuchsia-400"
      handleColor="bg-fuchsia-400"
    >
      {data.inputField && (
        <div className="space-y-0.5">
          <div className="truncate text-[10px]">
            Input: <code>{data.inputField}</code>
          </div>
          {data.cases && data.cases.length > 0 && (
            <div className="truncate opacity-70">
              {data.cases.length} case{data.cases.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
});

SwitchNode.displayName = "SwitchNode";
