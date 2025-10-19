"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type {
  WorkflowNode,
  NavigateNodeData,
} from "@/lib/types/workflow-editor.types";

interface NavigatePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<NavigateNodeData>) => void;
}

export function NavigatePanel({ node, onUpdate }: NavigatePanelProps) {
  const data = node.data as NavigateNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={data.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          The URL to navigate to. Supports variables.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="wait-nav">Wait for Navigation</Label>
            <p className="text-xs text-muted-foreground">
              Wait until page fully loads
            </p>
          </div>
          <Switch
            id="wait-nav"
            checked={data.waitForNavigation}
            onCheckedChange={(checked) =>
              onUpdate({ waitForNavigation: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wait-selector">Wait for Selector (Optional)</Label>
          <Input
            id="wait-selector"
            placeholder=".content-loaded"
            value={data.waitForSelector || ""}
            onChange={(e) => onUpdate({ waitForSelector: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Wait for specific element before continuing
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeout">Timeout (ms)</Label>
          <Input
            id="timeout"
            type="number"
            min="1000"
            max="120000"
            step="1000"
            value={data.timeout}
            onChange={(e) =>
              onUpdate({ timeout: parseInt(e.target.value) || 30000 })
            }
          />
          <p className="text-xs text-muted-foreground">
            Maximum time to wait for navigation (1-120 seconds)
          </p>
        </div>
      </div>
    </div>
  );
}
