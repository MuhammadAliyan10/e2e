"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WorkflowNode,
  ScreenshotNodeData,
} from "@/lib/types/workflow-nodes.types";

interface ScreenshotPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ScreenshotNodeData>) => void;
}

export function ScreenshotPanel({ node, onUpdate }: ScreenshotPanelProps) {
  const data = node.data as ScreenshotNodeData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>Full Page Screenshot</Label>
          <p className="text-xs text-muted-foreground">
            Capture entire scrollable page
          </p>
        </div>
        <Switch
          checked={data.fullPage}
          onCheckedChange={(checked) => onUpdate({ fullPage: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="selector">Element Selector (Optional)</Label>
        <Input
          id="selector"
          placeholder=".container, #main"
          value={data.selector || ""}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Capture specific element only
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Image Format</Label>
        <Select
          value={data.format}
          onValueChange={(value: any) => onUpdate({ format: value })}
        >
          <SelectTrigger id="format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG (Lossless)</SelectItem>
            <SelectItem value="jpeg">JPEG (Smaller)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
