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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clipboard, Info } from "lucide-react";
import type {
  WorkflowNode,
  ClipboardNodeData,
} from "@/lib/types/workflow-nodes.types";

interface ClipboardPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ClipboardNodeData>) => void;
}

export function ClipboardPanel({ node, onUpdate }: ClipboardPanelProps) {
  const data = node.data as ClipboardNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Select
          value={data.action || "copy"}
          onValueChange={(value: any) => onUpdate({ action: value })}
        >
          <SelectTrigger id="action">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="copy">Copy to Clipboard</SelectItem>
            <SelectItem value="paste">Paste from Clipboard</SelectItem>
            <SelectItem value="clear">Clear Clipboard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {data.action === "copy" && (
        <div className="space-y-2">
          <Label htmlFor="content">Content to Copy *</Label>
          <Textarea
            id="content"
            placeholder="Text to copy or {{variable}}"
            value={data.content || ""}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            Supports variables: {"{{"} extractedText {"}}"}
          </p>
        </div>
      )}

      {data.action === "paste" && (
        <div className="space-y-2">
          <Label htmlFor="targetVariable">Store Clipboard In *</Label>
          <Input
            id="targetVariable"
            placeholder="clipboardData"
            value={data.targetVariable || ""}
            onChange={(e) => onUpdate({ targetVariable: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Variable name to store clipboard content
          </p>
        </div>
      )}

      {data.action === "clear" && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This will clear the system clipboard. No configuration needed.
          </AlertDescription>
        </Alert>
      )}

      <Alert>
        <Clipboard className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Browser Permission Required:</strong> User must grant
          clipboard access permissions for this node to work. It may prompt on
          first use.
        </AlertDescription>
      </Alert>
    </div>
  );
}
