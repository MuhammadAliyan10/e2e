"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { ExtractNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const ExtractNode = memo((props: NodeProps<ExtractNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Download"
      iconBgColor="bg-amber-500"
      iconTextColor="text-white"
      dotColor="fill-amber-400 text-amber-400"
      handleColor="bg-amber-400"
    >
      {data.extractions && data.extractions.length > 0 && (
        <div className="truncate">
          Extracting {data.extractions.length} field
          {data.extractions.length !== 1 ? "s" : ""}
        </div>
      )}
    </BaseNode>
  );
});

ExtractNode.displayName = "ExtractNode";
