"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import type {
  WorkflowNode,
  ApiCallNodeData,
} from "@/lib/types/workflow-editor.types";

interface ApiPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ApiCallNodeData>) => void;
}

export function ApiPanel({ node, onUpdate }: ApiPanelProps) {
  const data = node.data as ApiCallNodeData;

  const addHeader = () => {
    onUpdate({
      headers: {
        ...data.headers,
        "": "",
      },
    });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...data.headers };
    if (oldKey !== newKey) {
      delete newHeaders[oldKey];
    }
    newHeaders[newKey] = value;
    onUpdate({ headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...data.headers };
    delete newHeaders[key];
    onUpdate({ headers: newHeaders });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Label htmlFor="method">Method</Label>
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
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            placeholder="https://api.example.com/data"
            value={data.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
          />
        </div>
      </div>

      <Tabs defaultValue="headers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>HTTP Headers</Label>
            <Button
              onClick={addHeader}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-3 w-3" />
              Add Header
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(data.headers || {}).map(([key, value]) => (
              <div key={key} className="grid grid-cols-5 gap-2">
                <Input
                  placeholder="Header name"
                  defaultValue={key}
                  onBlur={(e) => updateHeader(key, e.target.value, value)}
                  className="col-span-2"
                />
                <Input
                  placeholder="Value"
                  value={value}
                  onChange={(e) => updateHeader(key, key, e.target.value)}
                  className="col-span-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(key)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="body" className="space-y-3">
          <Label htmlFor="body">Request Body (JSON)</Label>
          <Textarea
            id="body"
            placeholder='{"key": "value"}'
            value={data.body || ""}
            onChange={(e) => onUpdate({ body: e.target.value })}
            rows={10}
            className="font-mono text-xs"
          />
        </TabsContent>

        <TabsContent value="auth" className="space-y-3">
          <div className="space-y-2">
            <Label>Authentication Type</Label>
            <Select
              value={data.auth?.type || "none"}
              onValueChange={(value: any) =>
                onUpdate({
                  auth: { type: value, credentials: {} },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.auth?.type === "bearer" && (
            <div className="space-y-2">
              <Label>Token</Label>
              <Input
                placeholder="Your bearer token"
                value={data.auth.credentials?.token || ""}
                onChange={(e) =>
                  onUpdate({
                    auth: {
                      type: data.auth ? data.auth.type : "none",
                      credentials: { token: e.target.value },
                    },
                  })
                }
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
