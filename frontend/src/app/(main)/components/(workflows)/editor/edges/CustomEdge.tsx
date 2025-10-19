"use client";

import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow";

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    markerEnd,
    style = {},
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
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            strokeWidth: 2,
            stroke: "hsl(var(--primary))",
          }}
        />
        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="bg-background border rounded px-2 py-0.5 text-[10px] font-medium shadow-sm"
            >
              {label}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
