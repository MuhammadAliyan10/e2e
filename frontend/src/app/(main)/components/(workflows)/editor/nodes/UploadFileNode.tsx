"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { UploadFileNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const UploadFileNode = memo((props: NodeProps<UploadFileNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Upload"
      iconBgColor="bg-orange-500"
      iconTextColor="text-white"
      dotColor="fill-orange-400 text-orange-400"
      handleColor="bg-orange-400"
    >
      {data.filePath && (
        <div className="truncate">
          <span className="opacity-70">File: </span>
          <code className="text-[10px]">{data.filePath.split("/").pop()}</code>
        </div>
      )}
    </BaseNode>
  );
});

UploadFileNode.displayName = "UploadFileNode";
