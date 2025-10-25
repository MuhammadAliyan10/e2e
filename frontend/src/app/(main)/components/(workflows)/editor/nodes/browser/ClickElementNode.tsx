// src/app/(main)/components/(workflows)/editor/nodes/browser/ClickElementNode.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps, useEdges } from "reactflow";
import {
  Play,
  Square,
  Trash2,
  Settings,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClickElementNodeData } from "@/lib/types/workflow-nodes.types";

const NodeHandle = ({
  id,
  type,
  position,
  nodeId,
  onAddNode,
}: {
  id: string;
  type: "source" | "target";
  position: Position;
  nodeId: string;
  onAddNode?: () => void;
}) => {
  const edges = useEdges();
  const isConnected =
    type === "source"
      ? edges.some((edge) => edge.source === nodeId)
      : edges.some((edge) => edge.target === nodeId);

  return (
    <>
      <Handle
        type={type}
        position={position}
        id={id}
        className="!w-4 !h-4 !bg-[#C3C9D5] !border-0 !rounded-full"
        style={
          position === Position.Right ? { right: "-8px" } : { left: "-8px" }
        }
      />
      {type === "source" && !isConnected && (
        <div className="absolute -right-[90px] top-1/2 -translate-y-1/2 flex items-center pointer-events-auto">
          <div className="w-14 h-[2px] bg-[#C3C9D5]" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNode?.();
            }}
            className="w-10 h-10 bg-[#414244] border-2 border-[#C3C9D5] rounded-md flex items-center justify-center text-white text-xl hover:bg-[#505052] transition-colors"
            aria-label="Add node"
          >
            +
          </button>
        </div>
      )}
    </>
  );
};

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
    className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a] border border-[#404040] rounded-md shadow-xl flex items-center gap-1 p-1.5"
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRun();
      }}
      disabled={running}
      className={cn(
        "p-1.5 rounded text-[#919298] hover:text-white hover:bg-green-600/20 transition-colors",
        running && "opacity-50 cursor-not-allowed"
      )}
      title="Run"
      aria-label="Run node"
    >
      <Play className="w-4 h-4" fill="currentColor" />
    </button>
    <div className="w-px h-4 bg-[#404040]" />
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "p-1.5 rounded transition-colors",
        enabled
          ? "text-orange-400 hover:bg-orange-600/20"
          : "text-blue-400 hover:bg-blue-600/20"
      )}
      title={enabled ? "Disable" : "Enable"}
      aria-label={enabled ? "Disable" : "Enable"}
    >
      <Square className="w-4 h-4" />
    </button>
    <div className="w-px h-4 bg-[#404040]" />
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="p-1.5 rounded text-[#919298] hover:text-white hover:bg-red-600/20 transition-colors"
      title="Delete"
      aria-label="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    <div className="w-px h-4 bg-[#404040]" />
    <button
      onClick={(e) => {
        e.stopPropagation();
        onConfigure();
      }}
      className="p-1.5 rounded text-[#919298] hover:text-white hover:bg-slate-600/20 transition-colors"
      title="Settings"
      aria-label="Settings"
    >
      <Settings className="w-4 h-4" />
    </button>
  </div>
);

interface ClickElementNodeProps extends NodeProps {
  data: ClickElementNodeData & {
    onRun?: (nodeId: string) => Promise<void>;
    onUpdate?: (data: Partial<ClickElementNodeData>) => void;
    onDelete?: () => void;
    onConfigure?: () => void;
    onAddNode?: (sourceNodeId: string, sourceHandleId: string) => void;
  };
}

export default function ClickElementNode({
  id,
  data,
  selected,
}: ClickElementNodeProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (isRunning || !data.enabled) return;

    setIsRunning(true);
    try {
      await data.onRun?.(id);
      data.onUpdate?.({
        executionState: "success",
        lastExecutedAt: new Date().toISOString(),
        errors: [],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Execution failed";
      data.onUpdate?.({
        executionState: "error",
        errors: [errorMessage],
      });
      console.error(`[ClickElementNode:${id}]`, error);
    } finally {
      setIsRunning(false);
    }
  }, [id, data, isRunning]);

  const handleToggle = useCallback(() => {
    data.onUpdate?.({ enabled: !data.enabled });
  }, [data]);

  const handleDelete = useCallback(() => {
    data.onDelete?.();
  }, [data]);

  const handleConfigure = useCallback(() => {
    data.onConfigure?.();
  }, [data]);

  const handleAddNode = useCallback(() => {
    data.onAddNode?.(id, "output");
  }, [id, data]);

  const getBorderColor = (): string => {
    if (data.executionState === "error") return "#ef4444";
    if (data.executionState === "success") return "#10b981";
    if (isRunning) return "#3b82f6";
    return "#C3C9D5";
  };

  return (
    <div
      className="relative w-[100px] h-[100px] bg-[#414244] cursor-pointer transition-all duration-200 group hover:shadow-lg hover:shadow-black/30"
      style={{
        border: `3px solid ${getBorderColor()}`,

        borderRadius: "10px",

        opacity: data.enabled ? 1 : 0.5,
      }}
      role="region"
      aria-label={`Click Element Node ${id}`}
    >
      {/* Tooltip */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        <NodeTooltip
          onRun={handleRun}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onConfigure={handleConfigure}
          enabled={data.enabled ?? true}
          running={isRunning}
        />
      </div>

      {/* Icon */}
      <div
        className="flex items-center justify-center h-full"
        onClick={handleRun}
        role="button"
        tabIndex={0}
      >
        <MousePointerClick className="w-12 h-12 text-[#C3C9D5]" />
      </div>

      {/* Input Handle (left) */}
      <NodeHandle
        id="input"
        type="target"
        position={Position.Left}
        nodeId={id}
      />

      {/* Output Handle (right) */}
      <NodeHandle
        id="output"
        type="source"
        position={Position.Right}
        nodeId={id}
        onAddNode={handleAddNode}
      />
    </div>
  );
}
