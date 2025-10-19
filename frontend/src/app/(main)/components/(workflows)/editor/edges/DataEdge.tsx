"use client";

import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow";

export const DataEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
    selected,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <defs>
          <linearGradient
            id={`edge-gradient-${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            strokeWidth: selected ? 3 : 2,
            stroke: selected ? "#3b82f6" : `url(#edge-gradient-${id})`,
            filter: selected
              ? "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))"
              : "none",
          }}
        />

        {data?.payload && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="nodrag nopan"
            >
              <div className="px-2 py-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg">
                <span className="text-[9px] text-blue-400 font-medium">
                  Data
                </span>
              </div>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

DataEdge.displayName = "DataEdge";
