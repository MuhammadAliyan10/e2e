"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  WorkflowNode,
  SelectNodeData,
} from "@/lib/types/workflow-nodes.types";

interface SelectPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<SelectNodeData>) => void;
}

export function SelectPanel({ node, onUpdate }: SelectPanelProps) {
  const data = node.data as SelectNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="selector">Dropdown Selector *</Label>
        <Input
          id="selector"
          placeholder="select[name='country'], #dropdown"
          value={data.selector}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          CSS selector for the select element
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Option Value *</Label>
        <Input
          id="value"
          placeholder="US, option-1, {{variable}}"
          value={data.value}
          onChange={(e) => onUpdate({ value: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Value or label of option to select
        </p>
      </div>
    </div>
  );
}
