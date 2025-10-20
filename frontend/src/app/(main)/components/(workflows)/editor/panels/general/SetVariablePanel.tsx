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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type {
  WorkflowNode,
  SetVariableNodeData,
} from "@/lib/types/workflow-nodes.types";

interface SetVariablePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<SetVariableNodeData>) => void;
}

export function SetVariablePanel({ node, onUpdate }: SetVariablePanelProps) {
  const data = node.data as SetVariableNodeData;

  const validateVariableName = (name: string) => {
    const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    return regex.test(name);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="variableName">Variable Name *</Label>
        <Input
          id="variableName"
          placeholder="myVariable"
          value={data.variableName || ""}
          onChange={(e) => onUpdate({ variableName: e.target.value })}
          className={
            data.variableName && !validateVariableName(data.variableName)
              ? "border-red-500"
              : ""
          }
        />
        {data.variableName && !validateVariableName(data.variableName) && (
          <p className="text-xs text-red-500">
            Invalid name. Use letters, numbers, _, $ (no spaces or special
            chars)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="variableType">Type</Label>
        <Select
          value={data.variableType || "string"}
          onValueChange={(value: any) => onUpdate({ variableType: value })}
        >
          <SelectTrigger id="variableType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="object">Object (JSON)</SelectItem>
            <SelectItem value="array">Array</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="value">Value *</Label>
        {data.variableType === "object" || data.variableType === "array" ? (
          <Textarea
            id="value"
            placeholder={
              data.variableType === "object"
                ? '{"key": "value"}'
                : '["item1", "item2"]'
            }
            value={data.value || ""}
            onChange={(e) => onUpdate({ value: e.target.value })}
            rows={6}
            className="font-mono text-sm"
          />
        ) : (
          <Input
            id="value"
            type={data.variableType === "number" ? "number" : "text"}
            placeholder={
              data.variableType === "boolean"
                ? "true or false"
                : data.variableType === "number"
                ? "123"
                : "Enter value"
            }
            value={data.value || ""}
            onChange={(e) => onUpdate({ value: e.target.value })}
          />
        )}
        <p className="text-xs text-muted-foreground">
          Supports variables: {"{{"} existingVar {"}}"}
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="scope">Scope</Label>
        <Select
          value={data.scope || "workflow"}
          onValueChange={(value: any) => onUpdate({ scope: value })}
        >
          <SelectTrigger id="scope">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="workflow">
              Workflow (current execution)
            </SelectItem>
            <SelectItem value="global">Global (all workflows)</SelectItem>
            <SelectItem value="session">Session (current user)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="encrypted" className="text-sm font-medium">
          Encrypt Value
        </Label>
        <Switch
          id="encrypted"
          checked={data.encrypted === true}
          onCheckedChange={(checked) => onUpdate({ encrypted: checked })}
        />
      </div>

      {data.encrypted && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Variable will be encrypted at rest using AES-256. Decrypted only
            during execution.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
