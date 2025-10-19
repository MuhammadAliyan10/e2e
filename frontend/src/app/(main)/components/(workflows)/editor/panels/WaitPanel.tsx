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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type {
  WorkflowNode,
  WaitNodeData,
} from "@/lib/types/workflow-editor.types";

interface WaitPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WaitNodeData>) => void;
}

export function WaitPanel({ node, onUpdate }: WaitPanelProps) {
  const data = node.data as WaitNodeData;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Pause workflow execution for a specified duration before continuing to
          the next node.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={data.duration}
            onChange={(e) =>
              onUpdate({ duration: parseInt(e.target.value) || 1 })
            }
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={data.unit}
            onValueChange={(value: any) => onUpdate({ unit: value })}
          >
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ms">Milliseconds</SelectItem>
              <SelectItem value="s">Seconds</SelectItem>
              <SelectItem value="m">Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-2">Total Wait Time:</p>
        <p className="text-2xl font-bold">
          {data.unit === "ms"
            ? `${data.duration}ms`
            : data.unit === "s"
            ? `${data.duration}s`
            : `${data.duration}m`}
        </p>
      </div>
    </div>
  );
}
