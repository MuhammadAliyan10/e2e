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
  ConditionNodeData,
} from "@/lib/types/workflow-editor.types";
import { VariablePicker } from "../VariablePicker";

interface ConditionPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ConditionNodeData>) => void;
}

export function ConditionPanel({ node, onUpdate }: ConditionPanelProps) {
  const data = node.data as ConditionNodeData;

  const addCondition = () => {
    onUpdate({
      conditions: [
        ...data.conditions,
        { variable: "", operator: "equals", value: "" },
      ],
    });
  };

  const updateCondition = (
    index: number,
    updates: Partial<ConditionNodeData["conditions"][0]>
  ) => {
    const newConditions = [...data.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    onUpdate({ conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onUpdate({
      conditions: data.conditions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Logic Operator</Label>
        <Select
          value={data.logic}
          onValueChange={(value: "AND" | "OR") => onUpdate({ logic: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND (all must match)</SelectItem>
            <SelectItem value="OR">OR (any must match)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Conditions</Label>
        <Button
          onClick={addCondition}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Condition
        </Button>
      </div>

      <div className="space-y-4">
        {data.conditions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No conditions set. Click "Add Condition" to start.
          </p>
        ) : (
          data.conditions.map((condition, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeCondition(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              <div className="space-y-2">
                <Label>Variable *</Label>
                <VariablePicker
                  value={condition.variable}
                  onChange={(value) =>
                    updateCondition(index, { variable: value })
                  }
                  placeholder="{{previousNode.output}}"
                />
              </div>

              <div className="space-y-2">
                <Label>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value: any) =>
                    updateCondition(index, { operator: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greaterThan">Greater Than</SelectItem>
                    <SelectItem value="lessThan">Less Than</SelectItem>
                    <SelectItem value="exists">Exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {condition.operator !== "exists" && (
                <div className="space-y-2">
                  <Label>Value *</Label>
                  <Input
                    placeholder="Expected value"
                    value={condition.value}
                    onChange={(e) =>
                      updateCondition(index, { value: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
