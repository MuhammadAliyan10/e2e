// src/app/(main)/components/(workflows)/editor/edges/DataEdge.tsx
"use client";

import { memo } from "react";
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
  MarkerType,
} from "reactflow";

interface DataEdgeData {
  label?: string;
}

export const DataEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,

    data,
    selected,
  }: EdgeProps<DataEdgeData>) => {
    const [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    return (
      <>
        {/* Main edge path with arrow */}
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={MarkerType.ArrowClosed}
          style={{
            strokeWidth: selected ? 3 : 2.5,
            stroke: selected ? "#3b82f6" : "#C3C9D5",
          }}
        />

        {/* Optional label */}
        {data?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px, ${
                  labelY - 20
                }px)`,
                pointerEvents: "none",
              }}
            >
              <div className="rounded bg-[#2a2a2a] px-2 py-0.5 text-xs text-gray-400 border border-[#414244]">
                {data.label}
              </div>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

DataEdge.displayName = "DataEdge";
