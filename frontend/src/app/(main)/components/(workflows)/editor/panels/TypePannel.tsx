"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type {
  WorkflowNode,
  TypeNodeData,
} from "@/lib/types/workflow-nodes.types";

interface TypePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<TypeNodeData>) => void;
}

export function TypePanel({ node, onUpdate }: TypePanelProps) {
  const data = node.data as TypeNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="selector">Input Selector *</Label>
        <Input
          id="selector"
          placeholder="#search, input[name='query']"
          value={data.selector}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          CSS selector for the input field
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Text to Type *</Label>
        <Textarea
          id="text"
          placeholder="Enter text or use {{variables}}"
          value={data.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Supports variables from previous nodes
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>Press Enter After Typing</Label>
          <p className="text-xs text-muted-foreground">
            Submit the form automatically
          </p>
        </div>
        <Switch
          checked={data.pressEnter}
          onCheckedChange={(checked) => onUpdate({ pressEnter: checked })}
        />
      </div>
    </div>
  );
}
