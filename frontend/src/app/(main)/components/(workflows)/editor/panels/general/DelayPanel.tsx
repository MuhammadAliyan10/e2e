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
  DelayNodeData,
} from "@/lib/types/workflow-nodes.types";

interface DelayPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<DelayNodeData>) => void;
}

export function DelayPanel({ node, onUpdate }: DelayPanelProps) {
  const data = node.data as DelayNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="delayType">Delay Type</Label>
        <Select
          value={data.delayType || "fixed"}
          onValueChange={(value: any) => onUpdate({ delayType: value })}
        >
          <SelectTrigger id="delayType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed Delay</SelectItem>
            <SelectItem value="random">Random Delay</SelectItem>
            <SelectItem value="conditional">Conditional Delay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {data.delayType === "fixed" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="delayMs">Delay Amount</Label>
            <div className="flex gap-2">
              <Input
                id="delayMs"
                type="number"
                min="0"
                value={data.delayMs || 1000}
                onChange={(e) =>
                  onUpdate({ delayMs: parseInt(e.target.value) || 0 })
                }
                className="flex-1"
              />
              <Select
                value={data.unit || "ms"}
                onValueChange={(value: any) => onUpdate({ unit: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ms">ms</SelectItem>
                  <SelectItem value="s">sec</SelectItem>
                  <SelectItem value="m">min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {data.delayType === "random" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minDelayMs">Min (ms)</Label>
              <Input
                id="minDelayMs"
                type="number"
                min="0"
                value={data.minDelayMs || 500}
                onChange={(e) =>
                  onUpdate({ minDelayMs: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDelayMs">Max (ms)</Label>
              <Input
                id="maxDelayMs"
                type="number"
                min="0"
                value={data.maxDelayMs || 2000}
                onChange={(e) =>
                  onUpdate({ maxDelayMs: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </>
      )}

      {data.delayType === "conditional" && (
        <div className="space-y-2">
          <Label htmlFor="condition">Condition Expression</Label>
          <Input
            id="condition"
            placeholder="e.g., {{responseTime}} > 500"
            value={data.condition || ""}
            onChange={(e) => onUpdate({ condition: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Use variables in {"{{}}"} syntax
          </p>
        </div>
      )}
    </div>
  );
}
