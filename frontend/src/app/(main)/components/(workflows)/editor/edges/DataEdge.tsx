// components/edges/DataEdge.tsx
"use client";

import { memo } from "react";
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow";

interface DataEdgeData {
  label?: string;
  onAddNode?: (sourceNodeId: string, edgeId: string) => void;
}

export const DataEdge = memo(
  ({
    id,

    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  }: EdgeProps<DataEdgeData>) => {
    const [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    // Calculate midpoint for the circular handle
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return (
      <>
        {/* Main edge path */}
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            strokeWidth: 3,
            stroke: "#C3C9D5",
          }}
        />

        {/* Circular handle in the middle */}
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${midX}px, ${midY}px)`,
              pointerEvents: "all",
            }}
          >
            <div
              className="w-5 h-5 rounded-full bg-[#C3C9D5] border-2 border-[#C3C9D5] cursor-pointer hover:scale-110 transition-transform"
              title="Connection point"
            />
          </div>

          {/* Optional label */}
          {data?.label && (
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
          )}
        </EdgeLabelRenderer>
      </>
    );
  }
);

DataEdge.displayName = "DataEdge";
