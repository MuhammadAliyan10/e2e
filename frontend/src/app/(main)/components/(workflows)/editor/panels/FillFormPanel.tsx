"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  FillFormNodeData,
} from "@/lib/types/workflow-editor.types";
import { VariablePicker } from "../VariablePicker";

interface FillFormPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<FillFormNodeData>) => void;
}

export function FillFormPanel({ node, onUpdate }: FillFormPanelProps) {
  const data = node.data as FillFormNodeData;

  const addField = () => {
    onUpdate({
      fields: [...data.fields, { selector: "", value: "", type: "text" }],
    });
  };

  const updateField = (
    index: number,
    updates: Partial<FillFormNodeData["fields"][0]>
  ) => {
    const newFields = [...data.fields];
    newFields[index] = { ...newFields[index], ...updates };
    onUpdate({ fields: newFields });
  };

  const removeField = (index: number) => {
    onUpdate({
      fields: data.fields.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Form Fields</Label>
        <Button
          onClick={addField}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Field
        </Button>
      </div>

      <div className="space-y-4">
        {data.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No fields configured. Click "Add Field" to start.
          </p>
        ) : (
          data.fields.map((field, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeField(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              <div className="space-y-2">
                <Label>Selector *</Label>
                <Input
                  placeholder="#email, input[name='email']"
                  value={field.selector}
                  onChange={(e) =>
                    updateField(index, { selector: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: any) =>
                    updateField(index, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Value *</Label>
                <VariablePicker
                  value={field.value}
                  onChange={(value) => updateField(index, { value })}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>Submit After Fill</Label>
          <p className="text-xs text-muted-foreground">
            Automatically submit form after filling
          </p>
        </div>
        <Switch
          checked={data.submitAfter}
          onCheckedChange={(checked) => onUpdate({ submitAfter: checked })}
        />
      </div>
    </div>
  );
}
