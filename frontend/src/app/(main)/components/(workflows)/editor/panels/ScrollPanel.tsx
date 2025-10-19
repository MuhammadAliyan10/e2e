"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WorkflowNode,
  ScrollNodeData,
} from "@/lib/types/workflow-nodes.types";

interface ScrollPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ScrollNodeData>) => void;
}

export function ScrollPanel({ node, onUpdate }: ScrollPanelProps) {
  const data = node.data as ScrollNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="direction">Scroll Direction</Label>
        <Select
          value={data.direction}
          onValueChange={(value: any) => onUpdate({ direction: value })}
        >
          <SelectTrigger id="direction">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up">Scroll Up</SelectItem>
            <SelectItem value="down">Scroll Down</SelectItem>
            <SelectItem value="toElement">Scroll to Element</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.direction === "toElement" ? (
        <div className="space-y-2">
          <Label htmlFor="selector">Target Element *</Label>
          <Input
            id="selector"
            placeholder="#section, .target"
            value={data.selector || ""}
            onChange={(e) => onUpdate({ selector: e.target.value })}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="distance">Scroll Distance (px)</Label>
          <Input
            id="distance"
            type="number"
            min="0"
            max="10000"
            value={data.distance}
            onChange={(e) =>
              onUpdate({ distance: parseInt(e.target.value) || 500 })
            }
          />
        </div>
      )}
    </div>
  );
}
