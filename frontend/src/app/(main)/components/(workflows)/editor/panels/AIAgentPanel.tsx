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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";
import type {
  WorkflowNode,
  AIAgentNodeData,
} from "@/lib/types/workflow-nodes.types";

interface AIAgentPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<AIAgentNodeData>) => void;
}

export function AIAgentPanel({ node, onUpdate }: AIAgentPanelProps) {
  const data = node.data as AIAgentNodeData;

  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          AI Agent autonomously navigates and interacts with websites based on
          your natural language instructions.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="url">Target URL *</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={data.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          The website where the AI will perform the task
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Task Prompt *</Label>
        <Textarea
          id="prompt"
          placeholder="Search for 'laptop' and extract the top 3 product names and prices"
          value={data.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Describe what you want the AI to do in natural language
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="context">Additional Context (Optional)</Label>
        <Textarea
          id="context"
          placeholder="Use filters on the left sidebar, sort by price..."
          value={data.context || ""}
          onChange={(e) => onUpdate({ context: e.target.value })}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Provide hints or constraints for the AI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">AI Model</Label>
          <Select
            value={data.model}
            onValueChange={(value: any) => onUpdate({ model: value })}
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4 (Best)</SelectItem>
              <SelectItem value="gpt-3.5-turbo">
                GPT-3.5 Turbo (Fast)
              </SelectItem>
              <SelectItem value="claude-3">Claude 3 (Accurate)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-steps">Max Steps</Label>
          <Input
            id="max-steps"
            type="number"
            min="1"
            max="50"
            value={data.maxSteps}
            onChange={(e) =>
              onUpdate({ maxSteps: parseInt(e.target.value) || 10 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="output-format">Output Format</Label>
        <Select
          value={data.outputFormat}
          onValueChange={(value: any) => onUpdate({ outputFormat: value })}
        >
          <SelectTrigger id="output-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="structured">Structured (JSON)</SelectItem>
            <SelectItem value="text">Plain Text</SelectItem>
            <SelectItem value="json">Raw JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
        <p className="font-medium">Output Schema:</p>
        <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
          {`{
  "success": boolean,
  "steps": [
    {
      "action": "navigate",
      "target": "https://...",
      "result": "success"
    }
  ],
  "result": {
    "extracted_data": {...}
  },
  "screenshots": ["base64..."]
}`}
        </pre>
      </div>
    </div>
  );
}
