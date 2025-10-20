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
import { Slider } from "@/components/ui/slider";
import type {
  WorkflowNode,
  NotificationNodeData,
} from "@/lib/types/workflow-nodes.types";

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
          value={data.type || "info"}
          onValueChange={(value: any) => onUpdate({ type: value })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Notification title"
          value={data.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Notification message"
          value={data.message || ""}
          onChange={(e) => onUpdate({ message: e.target.value })}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Supports variables: {"{{"} variableName {"}}"}
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select
          value={data.position || "top-right"}
          onValueChange={(value: any) => onUpdate({ position: value })}
        >
          <SelectTrigger id="position">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Auto-dismiss Duration (ms)</Label>
        <div className="flex items-center gap-4">
          <Slider
            id="duration"
            min={0}
            max={10000}
            step={500}
            value={[data.duration || 5000]}
            onValueChange={(value) => onUpdate({ duration: value[0] })}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-16 text-right">
            {data.duration || 5000}ms
          </span>
        </div>
        <p className="text-xs text-muted-foreground">0 = never auto-dismiss</p>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="sound" className="text-sm font-medium">
          Play Sound
        </Label>
        <Switch
          id="sound"
          checked={data.sound !== false}
          onCheckedChange={(checked) => onUpdate({ sound: checked })}
        />
      </div>
    </div>
  );
}
