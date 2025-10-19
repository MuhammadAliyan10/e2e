"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type {
  WorkflowNode,
  UploadFileNodeData,
} from "@/lib/types/workflow-nodes.types";

interface UploadFilePanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<UploadFileNodeData>) => void;
}

export function UploadFilePanel({ node, onUpdate }: UploadFilePanelProps) {
  const data = node.data as UploadFileNodeData;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          File must be accessible from the execution environment (uploaded to
          cloud storage or local path in worker container).
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="selector">File Input Selector *</Label>
        <Input
          id="selector"
          placeholder="input[type='file'], #file-upload"
          value={data.selector}
          onChange={(e) => onUpdate({ selector: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-path">File Path *</Label>
        <Input
          id="file-path"
          placeholder="/tmp/upload.pdf or {{previousNode.filePath}}"
          value={data.filePath}
          onChange={(e) => onUpdate({ filePath: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Absolute path or variable reference
        </p>
      </div>
    </div>
  );
}
