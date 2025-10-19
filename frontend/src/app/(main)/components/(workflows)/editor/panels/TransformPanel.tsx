"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type {
  WorkflowNode,
  TransformNodeData,
} from "@/lib/types/workflow-nodes.types";

interface TransformPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<TransformNodeData>) => void;
}

export function TransformPanel({ node, onUpdate }: TransformPanelProps) {
  const data = node.data as TransformNodeData;

  const addTransformation = () => {
    onUpdate({
      transformations: [
        ...(data.transformations || []),
        { input: "", output: "", function: "" },
      ],
    });
  };

  const updateTransformation = (index: number, updates: any) => {
    const newTransformations = [...(data.transformations || [])];
    newTransformations[index] = { ...newTransformations[index], ...updates };
    onUpdate({ transformations: newTransformations });
  };

  const removeTransformation = (index: number) => {
    onUpdate({
      transformations: data.transformations?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Transformations</Label>
        <Button
          onClick={addTransformation}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {data.transformations?.map((transform, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeTransformation(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            <Input
              placeholder="Input field: {{data.name}}"
              value={transform.input}
              onChange={(e) =>
                updateTransformation(index, { input: e.target.value })
              }
            />
            <Input
              placeholder="Output field: fullName"
              value={transform.output}
              onChange={(e) =>
                updateTransformation(index, { output: e.target.value })
              }
            />
            <Textarea
              placeholder="Function: value.toUpperCase()"
              value={transform.function}
              onChange={(e) =>
                updateTransformation(index, { function: e.target.value })
              }
              rows={2}
              className="font-mono text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
