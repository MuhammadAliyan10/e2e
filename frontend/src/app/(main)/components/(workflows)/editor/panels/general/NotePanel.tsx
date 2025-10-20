"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type {
  WorkflowNode,
  NoteNodeData,
} from "@/lib/types/workflow-nodes.types";

interface NotePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<NoteNodeData>) => void;
}

const PRESET_COLORS = [
  { label: "Yellow", value: "#fbbf24" },
  { label: "Pink", value: "#ec4899" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Purple", value: "#a855f7" },
  { label: "Orange", value: "#f97316" },
];

export function NotePanel({ node, onUpdate }: NotePanelProps) {
  const data = node.data as NoteNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="content">Note Content</Label>
        <Textarea
          id="content"
          placeholder="Add your notes here..."
          value={data.content || ""}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Color Theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.value}
              className="p-3 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: `${preset.value}20`,
                borderColor:
                  data.color === preset.value ? preset.value : "transparent",
              }}
              onClick={() => onUpdate({ color: preset.value })}
            >
              <div
                className="w-full h-6 rounded"
                style={{ backgroundColor: preset.value }}
              />
              <p className="text-xs text-center mt-1">{preset.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <div className="flex items-center gap-4">
          <Slider
            id="fontSize"
            min={10}
            max={20}
            step={1}
            value={[data.fontSize || 12]}
            onValueChange={(value) => onUpdate({ fontSize: value[0] })}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {data.fontSize || 12}px
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="collapsed" className="text-sm font-medium">
          Start Collapsed
        </Label>
        <Switch
          id="collapsed"
          checked={data.collapsed === true}
          onCheckedChange={(checked) => onUpdate({ collapsed: checked })}
        />
      </div>
    </div>
  );
}
