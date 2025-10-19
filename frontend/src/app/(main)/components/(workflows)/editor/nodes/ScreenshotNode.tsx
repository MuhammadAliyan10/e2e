"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { ScreenshotNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const ScreenshotNode = memo((props: NodeProps<ScreenshotNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Camera"
      iconBgColor="bg-cyan-500"
      iconTextColor="text-white"
      dotColor="fill-cyan-400 text-cyan-400"
      handleColor="bg-cyan-400"
    >
      {data.fullPage !== undefined && (
        <div className="truncate">
          {data.fullPage ? "Full page" : "Viewport only"} •{" "}
          {data.format || "png"}
        </div>
      )}
    </BaseNode>
  );
});

ScreenshotNode.displayName = "ScreenshotNode";
