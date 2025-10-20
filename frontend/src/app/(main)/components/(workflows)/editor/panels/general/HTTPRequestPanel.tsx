"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type {
  WorkflowNode,
  HTTPRequestNodeData,
} from "@/lib/types/workflow-nodes.types";

interface HTTPRequestPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<HTTPRequestNodeData>) => void;
}

export function HTTPRequestPanel({ node, onUpdate }: HTTPRequestPanelProps) {
  const data = node.data as HTTPRequestNodeData;
  const [headers, setHeaders] = useState(Object.entries(data.headers || {}));

  const addHeader = () => {
    setHeaders([...headers, ["", ""]]);
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = [key, value];
    setHeaders(newHeaders);
    onUpdate({ headers: Object.fromEntries(newHeaders.filter(([k]) => k)) });
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    onUpdate({ headers: Object.fromEntries(newHeaders.filter(([k]) => k)) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="method">Method</Label>
        <Select
          value={data.method || "GET"}
          onValueChange={(value: any) => onUpdate({ method: value })}
        >
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          placeholder="https://api.example.com/endpoint"
          value={data.url || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
      </div>

      <Separator />

      <Tabs defaultValue="headers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="space-y-4">
          {headers.map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Header name"
                value={key}
                onChange={(e) => updateHeader(index, e.target.value, value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={value}
                onChange={(e) => updateHeader(index, key, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHeader(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addHeader}>
            <Plus className="h-4 w-4 mr-2" />
            Add Header
          </Button>
        </TabsContent>

        <TabsContent value="body" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bodyType">Body Type</Label>
            <Select
              value={data.bodyType || "json"}
              onValueChange={(value: any) => onUpdate({ bodyType: value })}
            >
              <SelectTrigger id="bodyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="form">Form Data</SelectItem>
                <SelectItem value="raw">Raw</SelectItem>
                <SelectItem value="graphql">GraphQL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body Content</Label>
            <Textarea
              id="body"
              placeholder='{"key": "value"}'
              value={data.body || ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authType">Authentication Type</Label>
            <Select
              value={data.authentication?.type || "none"}
              onValueChange={(value: any) =>
                onUpdate({
                  authentication: { ...data.authentication, type: value },
                })
              }
            >
              <SelectTrigger id="authType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.authentication?.type === "bearer" && (
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="your-bearer-token"
                value={data.authentication.token || ""}
                onChange={(e) =>
                  onUpdate({
                    authentication: {
                      ...data.authentication,
                      token: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {data.authentication?.type === "basic" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={data.authentication.username || ""}
                  onChange={(e) =>
                    onUpdate({
                      authentication: {
                        ...data.authentication,
                        username: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.authentication.password || ""}
                  onChange={(e) =>
                    onUpdate({
                      authentication: {
                        ...data.authentication,
                        password: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          {data.authentication?.type === "apiKey" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={data.authentication.apiKey || ""}
                  onChange={(e) =>
                    onUpdate({
                      authentication: {
                        ...data.authentication,
                        apiKey: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKeyHeader">Header Name</Label>
                <Input
                  id="apiKeyHeader"
                  placeholder="X-API-Key"
                  value={data.authentication.apiKeyHeader || ""}
                  onChange={(e) =>
                    onUpdate({
                      authentication: {
                        ...data.authentication,
                        apiKeyHeader: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="responseVariable">Store Response In</Label>
        <Input
          id="responseVariable"
          placeholder="responseData"
          value={data.responseVariable || ""}
          onChange={(e) => onUpdate({ responseVariable: e.target.value })}
        />
      </div>
    </div>
  );
}
