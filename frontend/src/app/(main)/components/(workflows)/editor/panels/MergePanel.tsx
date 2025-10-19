"use client";

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
  MergeNodeData,
} from "@/lib/types/workflow-nodes.types";

interface MergePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<MergeNodeData>) => void;
}

export function MergePanel({ node, onUpdate }: MergePanelProps) {
  const data = node.data as MergeNodeData;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Merge node combines outputs from multiple incoming branches.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="mode">Merge Mode</Label>
        <Select
          value={data.mode}
          onValueChange={(value: any) => onUpdate({ mode: value })}
        >
          <SelectTrigger id="mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="append">Append (Array)</SelectItem>
            <SelectItem value="merge">Merge (Object)</SelectItem>
            <SelectItem value="first">First Only</SelectItem>
            <SelectItem value="last">Last Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          How to combine incoming data
        </p>
      </div>
    </div>
  );
}
