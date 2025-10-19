"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SetVariablePanelProps {
  node: any;
  onUpdate: (data: any) => void;
}

export function SetVariablePanel({ node, onUpdate }: SetVariablePanelProps) {
  const [variables, setVariables] = useState<
    Array<{ key: string; value: string }>
  >(node.data.variables || []);

  const addVariable = () => {
    const newVars = [...variables, { key: "", value: "" }];
    setVariables(newVars);
    onUpdate({ variables: newVars });
  };

  const updateVariable = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newVars = [...variables];
    newVars[index][field] = value;
    setVariables(newVars);
    onUpdate({ variables: newVars });
  };

  const removeVariable = (index: number) => {
    const newVars = variables.filter((_, i) => i !== index);
    setVariables(newVars);
    onUpdate({ variables: newVars });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Workflow Variables</Label>
        <Button
          onClick={addVariable}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {variables.map((variable, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Key"
              value={variable.key}
              onChange={(e) => updateVariable(index, "key", e.target.value)}
            />
            <Input
              placeholder="Value"
              value={variable.value}
              onChange={(e) => updateVariable(index, "value", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeVariable(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
