"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type {
  WorkflowNode,
  NotificationNodeData,
} from "@/lib/types/workflow-editor.types";

interface NotificationPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<NotificationNodeData>) => void;
}

export function NotificationPanel({ node, onUpdate }: NotificationPanelProps) {
  const data = node.data as NotificationNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="type">Notification Type</Label>
        <Select
          value={data.type}
          onValueChange={(value: any) => onUpdate({ type: value })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="recipient">
          {data.type === "email"
            ? "Email Address"
            : data.type === "slack"
            ? "Slack Webhook URL"
            : "Webhook URL"}{" "}
          *
        </Label>
        <Input
          id="recipient"
          placeholder={
            data.type === "email"
              ? "user@example.com"
              : "https://hooks.slack.com/..."
          }
          value={data.recipient}
          onChange={(e) => onUpdate({ recipient: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Enter notification message..."
          value={data.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Supports variables like {`{{$input.nodeName.output}}`}
        </p>
      </div>

      {data.type === "email" && (
        <div className="space-y-2">
          <Label htmlFor="template">Email Template (Optional)</Label>
          <Select
            value={data.template || "default"}
            onValueChange={(value) =>
              onUpdate({ template: value === "default" ? undefined : value })
            }
          >
            <SelectTrigger id="template">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="success">Success Report</SelectItem>
              <SelectItem value="error">Error Alert</SelectItem>
              <SelectItem value="summary">Execution Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
