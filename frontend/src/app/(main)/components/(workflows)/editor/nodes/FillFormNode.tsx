"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Badge } from "@/components/ui/badge";
import type { FillFormNodeData } from "@/lib/types/workflow-editor.types";
import { BaseNode } from "./BaseNode";

export const FillFormNode = memo((props: NodeProps<FillFormNodeData>) => {
  const { data } = props;

  return (
    <BaseNode {...props} icon="FileEdit" color="#10b981">
      <div className="space-y-2">
        {data.fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">No fields configured</p>
        ) : (
          <div className="space-y-1">
            <Badge variant="secondary" className="text-[10px] h-5">
              {data.fields.length} field{data.fields.length !== 1 && "s"}
            </Badge>
            {data.fields.slice(0, 2).map((field, idx) => (
              <div
                key={idx}
                className="text-xs bg-muted/50 px-2 py-1 rounded truncate"
              >
                {field.type}:{" "}
                <code className="text-[10px]">{field.selector}</code>
              </div>
            ))}
          </div>
        )}
        {data.submitAfter && (
          <Badge variant="outline" className="text-[10px] h-5">
            Auto-submit
          </Badge>
        )}
      </div>
    </BaseNode>
  );
});

FillFormNode.displayName = "FillFormNode";
