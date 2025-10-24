// src/app/(main)/components/(workflows)/editor/panels/OnClickTriggerConfig.tsx
"use client";

import * as React from "react";
import { NodeConfigGrid, OutputColumn } from "../NodeConfigDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";
import { InfoIcon } from "lucide-react";

interface OnClickTriggerConfigProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WorkflowNode["data"]>) => void;
  outputData?: any;
}

export function OnClickTriggerConfig({
  node,
  onUpdate,
  outputData,
}: OnClickTriggerConfigProps) {
  const data = node.data as any;

  return (
    <NodeConfigGrid layout="output-only">
      <div className="col-span-8 bg-[#1e1e1e] overflow-y-auto">
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#2a2a2a] mb-6">
            <button className="pb-3 border-b-2 border-[#ff6b6b] text-[#ff6b6b] font-medium">
              Parameters
            </button>
            <button className="pb-3 text-[#919298] hover:text-white">
              Settings
            </button>
            <button className="pb-3 text-[#919298] hover:text-white flex items-center gap-1">
              Docs
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-[#2d2d4a] border border-[#3d3d5a] rounded-lg flex gap-3">
            <InfoIcon className="w-5 h-5 text-[#818cf8] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-white">
                Tip: Get a feel for triggers with our quick{" "}
                <a href="#" className="text-[#818cf8] underline">
                  tutorial
                </a>{" "}
                or see an{" "}
                <a href="#" className="text-[#818cf8] underline">
                  example
                </a>{" "}
                of how this node works
              </p>
            </div>
            <button className="text-[#919298] hover:text-white ml-auto">
              ×
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Trigger Type */}
            <div>
              <Label
                htmlFor="triggerType"
                className="text-white text-sm mb-2 block"
              >
                Trigger Type
              </Label>
              <Select
                value={data.type || "manual"}
                onValueChange={(value) =>
                  onUpdate({
                    type: value as "success" | "error" | "warning" | "info",
                  })
                }
              >
                <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                  <SelectItem value="manual">Manual (Click)</SelectItem>
                  <SelectItem value="schedule">Schedule (Cron)</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="email">Email Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div>
              <Label htmlFor="label" className="text-white text-sm mb-2 block">
                Node Label
              </Label>
              <Input
                id="label"
                value={data.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="When clicking 'Execute workflow'"
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#606060]"
              />
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-white text-sm mb-2 block"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={data.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Describe what this trigger does..."
                rows={3}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#606060] resize-none"
              />
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="enabled" className="text-white text-sm">
                  Enable Trigger
                </Label>
                <p className="text-xs text-[#919298] mt-1">
                  When disabled, workflow won't start from this trigger
                </p>
              </div>
              <Switch
                id="enabled"
                checked={data.enabled ?? true}
                onCheckedChange={(enabled) => onUpdate({ enabled })}
              />
            </div>

            {/* Debounce */}
            <div>
              <Label
                htmlFor="debounce"
                className="text-white text-sm mb-2 block"
              >
                Debounce (ms)
              </Label>
              <Input
                id="debounce"
                type="number"
                value={data.debounceMs ?? 500}
                onChange={(e) =>
                  onUpdate({ debounceMs: parseInt(e.target.value) || 500 })
                }
                min={0}
                max={10000}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
              <p className="text-xs text-[#919298] mt-1">
                Minimum delay between consecutive trigger executions
              </p>
            </div>

            {/* Rate Limit */}
            <div>
              <Label
                htmlFor="rateLimit"
                className="text-white text-sm mb-2 block"
              >
                Rate Limit (per minute)
              </Label>
              <Input
                id="rateLimit"
                type="number"
                value={data.rateLimitPerMinute ?? ""}
                onChange={(e) =>
                  onUpdate({
                    rateLimitPerMinute: parseInt(e.target.value) || null,
                  })
                }
                placeholder="Unlimited"
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#606060]"
              />
            </div>

            {/* Max Executions */}
            <div>
              <Label
                htmlFor="maxExecutions"
                className="text-white text-sm mb-2 block"
              >
                Maximum Executions
              </Label>
              <Input
                id="maxExecutions"
                type="number"
                value={data.maxExecutions ?? ""}
                onChange={(e) =>
                  onUpdate({ maxExecutions: parseInt(e.target.value) || null })
                }
                placeholder="Unlimited"
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#606060]"
              />
            </div>

            {/* Options Section */}
            <div className="pt-4 border-t border-[#2a2a2a]">
              <Label className="text-white text-sm mb-3 block">Options</Label>
              <div className="text-sm text-[#919298]">No properties</div>
              <Button
                variant="outline"
                className="w-full mt-3 bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
              >
                Add Option
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Column */}
      <OutputColumn>
        {outputData ? (
          <div className="space-y-4">
            <pre className="bg-[#0d0d0d] border border-[#2a2a2a] rounded p-4 text-xs text-green-400 font-mono overflow-x-auto">
              {JSON.stringify(outputData, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-[#606060] mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white text-sm mb-2">
              Execute this node to view data
            </p>
            <p className="text-[#919298] text-xs mb-4">
              or{" "}
              <button className="text-[#ff6b6b] hover:underline">
                set mock data
              </button>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Execute previous nodes
            </Button>
            <p className="text-xs text-[#606060] mt-2">
              (From the earliest node that needs it ⓘ)
            </p>
          </div>
        )}
      </OutputColumn>
    </NodeConfigGrid>
  );
}
