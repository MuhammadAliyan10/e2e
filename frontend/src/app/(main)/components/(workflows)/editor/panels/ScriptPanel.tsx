"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Play } from "lucide-react";
import type {
  WorkflowNode,
  ScriptNodeData,
} from "@/lib/types/workflow-editor.types";

// Lazy load Monaco editor (heavy dependency)
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-muted rounded flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

interface ScriptPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ScriptNodeData>) => void;
}

const EXAMPLE_CODE = `// Access previous node outputs
const data = $input.previousNode.output;

// Perform custom logic
const result = data.items
  .filter(item => item.price > 100)
  .map(item => ({
    name: item.name,
    discounted: item.price * 0.9
  }));

// Return output (must return an object)
return {
  processed: result,
  count: result.length
};`;

export function ScriptPanel({ node, onUpdate }: ScriptPanelProps) {
  const data = node.data as ScriptNodeData;
  const [testOutput, setTestOutput] = useState<string>("");

  const handleTest = () => {
    try {
      // Basic syntax check
      new Function(data.code);
      setTestOutput("✅ Syntax valid. Test with real data during execution.");
    } catch (error: any) {
      setTestOutput(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Write custom JavaScript to transform data. Access previous nodes via{" "}
          <code className="bg-muted px-1">$input</code>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="editor">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="space-y-2">
            <Label>JavaScript Code</Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="300px"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={data.code}
                onChange={(value) => onUpdate({ code: value || "" })}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleTest}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Play className="h-3 w-3" />
              Test Syntax
            </Button>
            <Button
              onClick={() => onUpdate({ code: EXAMPLE_CODE })}
              variant="ghost"
              size="sm"
            >
              Load Example
            </Button>
          </div>

          {testOutput && (
            <pre className="p-3 bg-muted rounded text-xs whitespace-pre-wrap">
              {testOutput}
            </pre>
          )}

          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              min="100"
              max="30000"
              value={data.timeout}
              onChange={(e) =>
                onUpdate({ timeout: parseInt(e.target.value) || 5000 })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="help" className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-2">Available Variables:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                <code className="bg-muted px-1">$input</code> - All previous
                node outputs
              </li>
              <li>
                <code className="bg-muted px-1">$input.nodeId</code> - Specific
                node output
              </li>
              <li>
                <code className="bg-muted px-1">$vars</code> - Workflow
                variables
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">Return Format:</p>
            <pre className="bg-muted p-2 rounded text-xs">
              {`return {
  key: "value",
  data: [...]
};`}
            </pre>
          </div>

          <div>
            <p className="font-medium mb-2">Restrictions:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• No network requests (use HTTP Request node)</li>
              <li>• No file system access</li>
              <li>• No async/await (use Promise chains)</li>
              <li>• Sandboxed execution with VM2</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
