"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Play, Square, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnClickTriggerNode as OnClickTriggerNodeType } from "@/lib/types/workflow-nodes.types";

const NodeHandle = ({
  id,
  type,
  position,
  connected,
  onAddNode,
}: {
  id: string;
  type: "source" | "target";
  position: Position;
  connected: boolean;
  onAddNode?: () => void;
}) => (
  <div className="absolute -right-[89px] top-1/2 transform -translate-y-1/2 flex items-center">
    <Handle
      type={type}
      position={position}
      id={id}
      className="!static !transform-none !w-4 !h-4 !border-0 !bg-[#C3C9D5] !rounded-full !z-10"
    />
    {!connected && (
      <>
        <div className="w-12 h-[3px] bg-[#C3C9D5]" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddNode?.();
          }}
          className="w-8 h-8 bg-[#414244] border-[3px] border-[#C3C9D5]  flex items-center justify-center text-white text-lg hover:bg-[#505052] transition-colors duration-200"
        >
          +
        </button>
      </>
    )}
  </div>
);

const NodeTooltip = ({
  onRun,
  onToggle,
  onDelete,
  onConfigure,
  enabled,
  running,
}: {
  onRun: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onConfigure: () => void;
  enabled: boolean;
  running: boolean;
}) => (
  <div
    className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-50 bg-[#2a2a2a] border border-[#404040] rounded-lg shadow-lg flex items-center gap-1 p-1.5"
    onMouseDown={(e) => e.stopPropagation()}
  >
    {[
      {
        icon: Play,
        onClick: onRun,
        disabled: running,
        color: "green",
        title: "Run",
      },
      {
        icon: Square,
        onClick: onToggle,
        color: enabled ? "orange" : "blue",
        title: "Toggle",
      },
      { icon: Trash2, onClick: onDelete, color: "red", title: "Delete" },
      {
        icon: Settings,
        onClick: onConfigure,
        color: "gray",
        title: "Configure",
      },
    ].map(({ icon: Icon, onClick, disabled, title }, index) => (
      <button
        key={index}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "p-1.5 rounded text-[#919298] hover:text-white transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        title={title}
      >
        <Icon className="w-4 h-4" stroke="currentColor" />
      </button>
    ))}
  </div>
);

interface OnClickTriggerNodeProps extends NodeProps {
  data: OnClickTriggerNodeType["data"] & {
    onTrigger?: (payload: any) => Promise<void>;
    onUpdate?: (data: Partial<OnClickTriggerNodeType["data"]>) => void;
    onDelete?: () => void;
    onConfigure?: () => void;
    onAddNode?: (sourceNodeId: string, sourceHandleId: string) => void;
  };
}

export default function OnClickTriggerNode({
  id,
  data,
}: OnClickTriggerNodeProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handles = useMemo(
    () => ({
      output: { connected: false },
    }),
    []
  );

  const handleRun = useCallback(async () => {
    if (isRunning || !data.enabled) return;
    setIsRunning(true);
    try {
      await data.onTrigger?.({
        nodeId: id,
        nodeType: "trigger",
        timestamp: new Date().toISOString(),
      });
      data.onUpdate?.({
        executionState: "success",
        lastExecutedAt: new Date().toISOString(),
        errors: [],
      });
    } catch (err) {
      data.onUpdate?.({
        executionState: "error",
        errors: [err instanceof Error ? err.message : "Execution failed"],
      });
    } finally {
      setIsRunning(false);
    }
  }, [id, data, isRunning]);

  const handleToggle = useCallback(
    () => data.onUpdate?.({ enabled: !data.enabled }),
    [data]
  );
  const handleDelete = useCallback(() => data.onDelete?.(), [data]);
  const handleConfigure = useCallback(() => data.onConfigure?.(), [data]);
  const handleAddNode = useCallback(
    () => data.onAddNode?.(id, "output"),
    [id, data]
  );

  const getBorderColor = () => {
    if (data.executionState === "error") return "#ef4444";
    if (data.executionState === "success") return "#10b981";
    if (isRunning) return "#3b82f6";
    return "#C3C9D5";
  };

  return (
    <div className="relative group">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <NodeTooltip
          onRun={handleRun}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onConfigure={handleConfigure}
          enabled={data.enabled ?? true}
          running={isRunning}
        />
      </div>

      {/* Main Node */}
      <div
        className={cn(
          "relative w-[100px] h-[100px] bg-[#414244] cursor-pointer flex items-center justify-center",
          "rounded-tl-[60px] rounded-bl-[60px] border-[3px]",
          "transition-all duration-200 hover:shadow-lg hover:shadow-black/30",
          !data.enabled && "opacity-60",
          isRunning && "animate-pulse"
        )}
        style={{ borderColor: getBorderColor() }}
        onClick={handleRun}
      >
        {/* Cursor Icon */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#C3C9D5]"
        >
          <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" />
        </svg>

        {/* Output Handle */}
        <NodeHandle
          id="output"
          type="source"
          position={Position.Right}
          connected={handles.output.connected}
          onAddNode={handleAddNode}
        />
      </div>

      {/* Label */}
      <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-sm font-medium leading-tight">Trigger</p>
      </div>
    </div>
  );
}
