"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Info,
  Calendar,
  Webhook,
  Hand,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type {
  WorkflowNode,
  TriggerNodeData,
} from "@/lib/types/workflow-nodes.types";

interface TriggerPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<TriggerNodeData>) => void;
}

export function TriggerPanel({ node, onUpdate }: TriggerPanelProps) {
  const data = node.data as TriggerNodeData;

  const [localType, setLocalType] = useState(data.type || "manual");
  const [localSchedule, setLocalSchedule] = useState(data.schedule || "");
  const [localWebhookUrl, setLocalWebhookUrl] = useState(
    data.webhookUrl || `https://api.horizen.app/webhooks/${node.id}`
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate cron expression
  const validateCron = (expression: string): boolean => {
    if (!expression.trim()) return false;

    const fields = expression.trim().split(/\s+/);
    if (fields.length !== 5) {
      setValidationError(
        "Cron must have 5 fields (minute hour day month weekday)"
      );
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleTypeChange = (type: "manual" | "schedule" | "webhook") => {
    setLocalType(type);
    onUpdate({ type });
  };

  const handleScheduleChange = (schedule: string) => {
    setLocalSchedule(schedule);
    if (validateCron(schedule)) {
      onUpdate({ schedule });
    }
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(localWebhookUrl);
    toast.success("Webhook URL copied to clipboard");
  };

  const handleTestTrigger = () => {
    toast.info("Test trigger fired (implement backend integration)");
  };

  // Generate webhook URL
  useEffect(() => {
    if (localType === "webhook") {
      const generatedUrl = `https://api.horizen.app/webhooks/${node.id}`;
      setLocalWebhookUrl(generatedUrl);
      onUpdate({ webhookUrl: generatedUrl });
    }
  }, [localType, node.id]);

  return (
    <div className="space-y-6 space-x-4">
      {/* Trigger Type Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Trigger Type</Label>
        <div className="grid grid-cols-3 gap-2 px-4">
          <button
            onClick={() => handleTypeChange("manual")}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
              ${
                localType === "manual"
                  ? "border-green-500 bg-green-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }
            `}
          >
            <Hand
              className={`w-6 h-6 ${
                localType === "manual" ? "text-green-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-medium text-white">Manual</span>
          </button>

          <button
            onClick={() => handleTypeChange("schedule")}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
              ${
                localType === "schedule"
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }
            `}
          >
            <Calendar
              className={`w-6 h-6 ${
                localType === "schedule" ? "text-amber-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-medium text-white">Schedule</span>
          </button>

          <button
            onClick={() => handleTypeChange("webhook")}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
              ${
                localType === "webhook"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }
            `}
          >
            <Webhook
              className={`w-6 h-6 ${
                localType === "webhook" ? "text-purple-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-medium text-white">Webhook</span>
          </button>
        </div>
      </div>

      {/* Manual Trigger Info */}
      {localType === "manual" && (
        <div className="space-y-4">
          <Alert className="border-green-500/30 bg-green-500/5">
            <Info className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-slate-300">
              This workflow will only execute when you click the "Execute"
              button in the toolbar. Use manual triggers for on-demand
              workflows.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Schedule Configuration */}
      {localType === "schedule" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-sm font-semibold">
              Cron Expression *
            </Label>
            <Input
              id="schedule"
              placeholder="0 */6 * * * (every 6 hours)"
              value={localSchedule}
              onChange={(e) => handleScheduleChange(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white font-mono text-sm"
            />
            {validationError && (
              <p className="text-xs text-red-400">{validationError}</p>
            )}
            <p className="text-xs text-slate-400">
              Format: minute (0-59) hour (0-23) day (1-31) month (1-12) weekday
              (0-6)
            </p>
          </div>

          {/* Common Patterns */}
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-sm font-medium text-white mb-3">
              Common Patterns:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleScheduleChange("0 * * * *")}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
              >
                <code className="text-xs text-amber-300">0 * * * *</code>
                <span className="text-xs text-slate-400">Every hour</span>
              </button>
              <button
                onClick={() => handleScheduleChange("0 0 * * *")}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
              >
                <code className="text-xs text-amber-300">0 0 * * *</code>
                <span className="text-xs text-slate-400">
                  Daily at midnight
                </span>
              </button>
              <button
                onClick={() => handleScheduleChange("0 9 * * 1-5")}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
              >
                <code className="text-xs text-amber-300">0 9 * * 1-5</code>
                <span className="text-xs text-slate-400">9am weekdays</span>
              </button>
              <button
                onClick={() => handleScheduleChange("*/15 * * * *")}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
              >
                <code className="text-xs text-amber-300">*/15 * * * *</code>
                <span className="text-xs text-slate-400">Every 15 minutes</span>
              </button>
            </div>
          </div>

          {localSchedule && !validationError && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-xs text-green-300">Valid cron expression</p>
            </div>
          )}
        </div>
      )}

      {/* Webhook Configuration */}
      {localType === "webhook" && (
        <div className="space-y-4">
          <Alert className="border-purple-500/30 bg-purple-500/5">
            <Webhook className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-slate-300">
              Send HTTP POST requests to this URL to trigger workflow execution.
              Request body will be available as{" "}
              <code className="text-purple-300">{"{{$trigger.body}}"}</code>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={localWebhookUrl}
                readOnly
                className="bg-slate-800/50 border-slate-700 text-slate-300 font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyWebhook}
                className="shrink-0 border-slate-700 hover:bg-slate-800"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Example Request */}
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-sm font-medium text-white mb-3">
              Example Request:
            </p>
            <pre className="text-xs text-slate-300 overflow-x-auto">
              {`curl -X POST \\
  ${localWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user123",
    "action": "process_data"
  }'`}
            </pre>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-300 font-medium mb-1">
              Security Features (Coming Soon):
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>HMAC SHA-256 signature validation</li>
              <li>IP whitelist configuration</li>
              <li>Rate limiting (100 req/min default)</li>
              <li>Custom authentication headers</li>
            </ul>
          </div>
        </div>
      )}

      {/* Test Trigger Button */}
      <div className="pt-4 border-t border-slate-700">
        <Button
          onClick={handleTestTrigger}
          variant="outline"
          className="w-full gap-2 border-slate-700 hover:bg-slate-800"
        >
          <Hand className="w-4 h-4" />
          Test Trigger
        </Button>
      </div>

      {/* Trigger Metadata */}
      <div className="p-4 bg-slate-800/20 rounded-lg border border-slate-700/50">
        <p className="text-xs font-medium text-slate-300 mb-2">
          Trigger Information:
        </p>
        <div className="space-y-1 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Node ID:</span>
            <code className="text-slate-300">{node.id}</code>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <Badge variant="outline" className="text-[10px] h-5">
              {localType}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
