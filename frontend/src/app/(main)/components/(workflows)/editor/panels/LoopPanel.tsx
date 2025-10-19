"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type {
  WorkflowNode,
  LoopNodeData,
} from "@/lib/types/workflow-editor.types";
import { VariablePicker } from "../VariablePicker";

interface LoopPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<LoopNodeData>) => void;
}

export function LoopPanel({ node, onUpdate }: LoopPanelProps) {
  const data = node.data as LoopNodeData;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Loop nodes repeat the connected branch for each item in the array.
          Access current item via{" "}
          <code className="bg-muted px-1">{"{{$item}}"}</code>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="items">Items Array *</Label>
        <VariablePicker
          value={data.items}
          onChange={(value) => onUpdate({ items: value })}
          placeholder="{{previousNode.output.items}}"
        />
        <p className="text-xs text-muted-foreground">
          Variable path or expression that returns an array
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-iterations">Max Iterations</Label>
        <Input
          id="max-iterations"
          type="number"
          min="1"
          max="10000"
          value={data.maxIterations}
          onChange={(e) =>
            onUpdate({ maxIterations: parseInt(e.target.value) || 100 })
          }
        />
        <p className="text-xs text-muted-foreground">
          Safety limit to prevent infinite loops (1-10,000)
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
        <p className="font-medium">Loop Variables:</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>
            <code className="bg-background px-1">{"{{$item}}"}</code> - Current
            item
          </li>
          <li>
            <code className="bg-background px-1">{"{{$index}}"}</code> - Current
            index (0-based)
          </li>
          <li>
            <code className="bg-background px-1">{"{{$length}}"}</code> - Total
            items
          </li>
        </ul>
      </div>
    </div>
  );
}
