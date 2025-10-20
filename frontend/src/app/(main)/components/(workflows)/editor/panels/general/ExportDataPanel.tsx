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
import { FileDown } from "lucide-react";
import type {
  WorkflowNode,
  ExportDataNodeData,
} from "@/lib/types/workflow-nodes.types";

interface ExportDataPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ExportDataNodeData>) => void;
}

export function ExportDataPanel({ node, onUpdate }: ExportDataPanelProps) {
  const data = node.data as ExportDataNodeData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="format">Export Format</Label>
        <Select
          value={data.format || "json"}
          onValueChange={(value: any) => onUpdate({ format: value })}
        >
          <SelectTrigger id="format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
            <SelectItem value="txt">Plain Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileName">File Name *</Label>
        <Input
          id="fileName"
          placeholder="export-data.json"
          value={data.fileName || ""}
          onChange={(e) => onUpdate({ fileName: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Supports variables: {"{{"} workflowName {"}}"}-{"{{"} timestamp {"}}"}
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="data">Data Source *</Label>
        <Textarea
          id="data"
          placeholder="{{extractedData}} or paste JSON directly"
          value={data.data || ""}
          onChange={(e) => onUpdate({ data: e.target.value })}
          rows={6}
          className="font-mono text-sm"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="downloadToClient" className="text-sm font-medium">
            Download to Browser
          </Label>
          <Switch
            id="downloadToClient"
            checked={data.downloadToClient !== false}
            onCheckedChange={(checked) =>
              onUpdate({ downloadToClient: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="saveToServer" className="text-sm font-medium">
            Save to Server
          </Label>
          <Switch
            id="saveToServer"
            checked={data.saveToServer === true}
            onCheckedChange={(checked) => onUpdate({ saveToServer: checked })}
          />
        </div>

        {data.saveToServer && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="serverPath">Server Path</Label>
            <Input
              id="serverPath"
              placeholder="/exports/data"
              value={data.serverPath || ""}
              onChange={(e) => onUpdate({ serverPath: e.target.value })}
            />
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="includeTimestamp" className="text-sm font-medium">
            Include Timestamp in Filename
          </Label>
          <Switch
            id="includeTimestamp"
            checked={data.includeTimestamp !== false}
            onCheckedChange={(checked) =>
              onUpdate({ includeTimestamp: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compression">Compression</Label>
          <Select
            value={data.compression || "none"}
            onValueChange={(value: any) => onUpdate({ compression: value })}
          >
            <SelectTrigger id="compression">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="zip">ZIP</SelectItem>
              <SelectItem value="gzip">GZIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert>
        <FileDown className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {data.format === "csv" &&
            "CSV exports work best with flat array data"}
          {data.format === "xlsx" &&
            "Excel exports support multiple sheets via arrays"}
          {data.format === "json" &&
            "JSON preserves all data types and structures"}
        </AlertDescription>
      </Alert>
    </div>
  );
}
