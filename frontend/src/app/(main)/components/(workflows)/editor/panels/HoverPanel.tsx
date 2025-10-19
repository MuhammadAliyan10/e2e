"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  WorkflowNode,
  HoverNodeData,
} from "@/lib/types/workflow-nodes.types";

interface HoverPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<HoverNodeData>) => void;
}

export function HoverPanel({ node, onUpdate }: HoverPanelProps) {
  const data = node.data as HoverNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="selector">Element Selector *</Label>
        <Input
          id="selector"
          placeholder=".dropdown-trigger, #menu-item"
          value={data.selector}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Element to hover over</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Hover Duration (ms)</Label>
        <Input
          id="duration"
          type="number"
          min="0"
          max="5000"
          value={data.duration}
          onChange={(e) =>
            onUpdate({ duration: parseInt(e.target.value) || 500 })
          }
        />
        <p className="text-xs text-muted-foreground">
          How long to maintain hover state
        </p>
      </div>
    </div>
  );
}
