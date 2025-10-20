"use client";

import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow";

interface CustomEdgeProps extends EdgeProps {
  data?: {
    isDashed?: boolean;
    label?: string;
  };
}

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    style,
  }: CustomEdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const isDashed = data?.isDashed || false;

    return (
      <>
        <defs>
          <marker
            id={`arrow-${id}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill={selected ? "#3b82f6" : "#22c55e"}
              className="transition-colors duration-200"
            />
          </marker>
        </defs>

        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={`url(#arrow-${id})`}
          style={{
            strokeWidth: selected ? 2.5 : 2,
            stroke: selected ? "#3b82f6" : "#22c55e",
            strokeDasharray: isDashed ? "5,5" : "none",
            opacity: isDashed ? 0.6 : 1,
            ...style,
          }}
        />

        {data?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="nodrag nopan"
            >
              <div className="px-2 py-0.5 bg-[#1e1e1e] border border-slate-600 rounded text-xs text-slate-400">
                {data.label}
              </div>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
