"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "../BaseNode";

interface SetVariableNodeData {
  label: string;
  variables?: Array<{ key: string; value: string }>;
}

export const SetVariableNode = memo((props: NodeProps<SetVariableNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Variable"
      iconBgColor="bg-purple-600"
      iconTextColor="text-white"
      dotColor="fill-purple-400 text-purple-400"
      handleColor="bg-purple-400"
    >
      {data.variables && data.variables.length > 0 && (
        <div className="truncate">
          Setting {data.variables.length} variable
          {data.variables.length !== 1 ? "s" : ""}
        </div>
      )}
    </BaseNode>
  );
});

SetVariableNode.displayName = "SetVariableNode";
