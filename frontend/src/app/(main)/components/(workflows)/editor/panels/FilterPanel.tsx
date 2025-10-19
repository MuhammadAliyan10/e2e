"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type {
  WorkflowNode,
  FilterNodeData,
} from "@/lib/types/workflow-nodes.types";

interface FilterPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<FilterNodeData>) => void;
}

export function FilterPanel({ node, onUpdate }: FilterPanelProps) {
  const data = node.data as FilterNodeData;

  const addCondition = () => {
    onUpdate({
      conditions: [
        ...(data.conditions || []),
        { field: "", operator: "equals", value: "" },
      ],
    });
  };

  const updateCondition = (index: number, updates: any) => {
    const newConditions = [...(data.conditions || [])];
    newConditions[index] = { ...newConditions[index], ...updates };
    onUpdate({ conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onUpdate({
      conditions: data.conditions?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Filter Conditions</Label>
        <Button
          onClick={addCondition}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {data.conditions?.map((condition, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeCondition(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            <Input
              placeholder="Field: {{item.price}}"
              value={condition.field}
              onChange={(e) =>
                updateCondition(index, { field: e.target.value })
              }
            />

            <Select
              value={condition.operator}
              onValueChange={(value) =>
                updateCondition(index, { operator: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="gt">Greater Than</SelectItem>
                <SelectItem value="lt">Less Than</SelectItem>
                <SelectItem value="exists">Exists</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Value"
              value={condition.value}
              onChange={(e) =>
                updateCondition(index, { value: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
