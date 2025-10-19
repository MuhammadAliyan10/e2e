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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  WorkflowNode,
  WebhookNodeData,
} from "@/lib/types/workflow-nodes.types";

interface WebhookPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WebhookNodeData>) => void;
}

export function WebhookPanel({ node, onUpdate }: WebhookPanelProps) {
  const data = node.data as WebhookNodeData;

  const webhookUrl = `https://api.horizen.app/webhooks/${
    data.path || "your-path"
  }`;

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("Webhook URL copied");
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Webhook receives HTTP requests and triggers workflow execution.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="method">HTTP Method</Label>
        <Select
          value={data.method}
          onValueChange={(value: any) => onUpdate({ method: value })}
        >
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="path">Webhook Path *</Label>
        <Input
          id="path"
          placeholder="my-webhook-endpoint"
          value={data.path}
          onChange={(e) => onUpdate({ path: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Webhook URL</Label>
        <div className="flex items-center gap-2">
          <Input value={webhookUrl} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={copyUrl}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="response-mode">Response Mode</Label>
        <Select
          value={data.responseMode}
          onValueChange={(value: any) => onUpdate({ responseMode: value })}
        >
          <SelectTrigger id="response-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastNode">Last Node Output</SelectItem>
            <SelectItem value="onReceived">Immediate Ack</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
