"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type {
  WorkflowNode,
  SwitchNodeData,
} from "@/lib/types/workflow-nodes.types";

interface SwitchPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<SwitchNodeData>) => void;
}

export function SwitchPanel({ node, onUpdate }: SwitchPanelProps) {
  const data = node.data as SwitchNodeData;

  const addCase = () => {
    onUpdate({
      cases: [
        ...(data.cases || []),
        { value: "", outputIndex: data.cases?.length || 0 },
      ],
    });
  };

  const updateCase = (index: number, updates: any) => {
    const newCases = [...(data.cases || [])];
    newCases[index] = { ...newCases[index], ...updates };
    onUpdate({ cases: newCases });
  };

  const removeCase = (index: number) => {
    onUpdate({
      cases: data.cases?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="input-field">Input Field *</Label>
        <Input
          id="input-field"
          placeholder="{{previousNode.status}}"
          value={data.inputField}
          onChange={(e) => onUpdate({ inputField: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Variable to evaluate</p>
      </div>

      <div className="flex items-center justify-between">
        <Label>Cases</Label>
        <Button onClick={addCase} size="sm" variant="outline" className="gap-2">
          <Plus className="h-3 w-3" />
          Add Case
        </Button>
      </div>

      <div className="space-y-2">
        {data.cases?.map((caseItem, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 border rounded-lg"
          >
            <Input
              placeholder="Value"
              value={caseItem.value}
              onChange={(e) => updateCase(index, { value: e.target.value })}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCase(index)}
              className="h-8 w-8"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
