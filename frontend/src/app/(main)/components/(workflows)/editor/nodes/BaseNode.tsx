"use client";

import { memo, ReactNode } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { getNodeIcon } from "@/lib/utils/get-node-icon";

interface BaseNodeProps extends NodeProps {
  icon: string;
  iconColor: string; // Icon color inside black box
  dotColor?: string; // Right status dot color
  handleColor?: string; // Output handle color
  hasInputHandle?: boolean;
  hasOutputHandle?: boolean;
  roundedLeft?: boolean; // Round left corners (trigger node)
  children?: ReactNode;
}

export const BaseNode = memo(
  ({
    data,
    icon,
    iconColor,
    dotColor = "#64748b",
    handleColor = "#64748b",
    selected,
    hasInputHandle = true,
    hasOutputHandle = true,
    roundedLeft = false,
    children,
  }: BaseNodeProps) => {
    const IconComponent = getNodeIcon(icon);

    return (
      <div
        className={cn(
          "relative min-w-[220px] bg-[#19202F] transition-all duration-200",
          "border-2",
          roundedLeft ? "rounded-l-full rounded-r-lg" : "rounded-lg",
          selected
            ? "border-blue-500 shadow-lg shadow-blue-500/20"
            : "border-slate-700/50 hover:border-slate-600"
        )}
      >
        {/* Left Handle (Input) */}
        {hasInputHandle && (
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-slate-600 !border-2 !border-[#19202F] hover:!scale-110 transition-transform"
            style={{ left: -6 }}
          />
        )}

        {/* Node Content */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Icon Box (Black with colored icon) */}
          <div className="w-11 h-11 bg-black rounded-lg flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
          </div>

          {/* Node Label & Content */}
          <div className="flex-1 min-w-0">
            <span className="text-white font-semibold text-sm block truncate">
              {data?.label || "Untitled"}
            </span>
            {children && (
              <div className="mt-1 text-xs text-slate-400">{children}</div>
            )}
          </div>

          {/* Status Dot (Right) */}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
          />
        </div>

        {/* Right Handle (Output) */}
        {hasOutputHandle && (
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !border-2 !border-[#19202F] hover:!scale-110 transition-transform"
            style={{ right: -6, backgroundColor: handleColor }}
          />
        )}
      </div>
    );
  }
);

BaseNode.displayName = "BaseNode";
