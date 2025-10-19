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
import { Separator } from "@/components/ui/separator";
import type {
  WorkflowNode,
  ClickNodeData,
} from "@/lib/types/workflow-editor.types";

interface ClickPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ClickNodeData>) => void;
}

export function ClickPanel({ node, onUpdate }: ClickPanelProps) {
  const data = node.data as ClickNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="selector">CSS Selector *</Label>
        <Input
          id="selector"
          placeholder="#submit-btn, button[type='submit']"
          value={data.selector}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          CSS selector to identify the element to click
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="click-type">Click Type</Label>
        <Select
          value={data.clickType}
          onValueChange={(value: any) => onUpdate({ clickType: value })}
        >
          <SelectTrigger id="click-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Click</SelectItem>
            <SelectItem value="double">Double Click</SelectItem>
            <SelectItem value="right">Right Click</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wait-after">Wait After Click (ms)</Label>
        <Input
          id="wait-after"
          type="number"
          min="0"
          max="10000"
          step="100"
          value={data.waitAfterClick}
          onChange={(e) =>
            onUpdate({ waitAfterClick: parseInt(e.target.value) || 0 })
          }
        />
        <p className="text-xs text-muted-foreground">
          Time to wait after clicking before proceeding
        </p>
      </div>
    </div>
  );
}
