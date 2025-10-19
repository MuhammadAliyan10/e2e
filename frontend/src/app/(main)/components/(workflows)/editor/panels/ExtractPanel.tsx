"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import type {
  WorkflowNode,
  ExtractNodeData,
} from "@/lib/types/workflow-editor.types";

interface ExtractPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ExtractNodeData>) => void;
}

export function ExtractPanel({ node, onUpdate }: ExtractPanelProps) {
  const data = node.data as ExtractNodeData;

  const addExtraction = () => {
    onUpdate({
      extractions: [
        ...data.extractions,
        { name: "", selector: "", attribute: undefined, multiple: false },
      ],
    });
  };

  const updateExtraction = (
    index: number,
    updates: Partial<ExtractNodeData["extractions"][0]>
  ) => {
    const newExtractions = [...data.extractions];
    newExtractions[index] = { ...newExtractions[index], ...updates };
    onUpdate({ extractions: newExtractions });
  };

  const removeExtraction = (index: number) => {
    onUpdate({
      extractions: data.extractions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Data Extractions</Label>
        <Button
          onClick={addExtraction}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Extraction
        </Button>
      </div>

      <div className="space-y-4">
        {data.extractions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No extractions configured. Click "Add Extraction" to start.
          </p>
        ) : (
          data.extractions.map((extraction, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeExtraction(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              <div className="space-y-2">
                <Label>Variable Name *</Label>
                <Input
                  placeholder="productName, price, description"
                  value={extraction.name}
                  onChange={(e) =>
                    updateExtraction(index, { name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>CSS Selector *</Label>
                <Input
                  placeholder=".product-title, #price"
                  value={extraction.selector}
                  onChange={(e) =>
                    updateExtraction(index, { selector: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Attribute (Optional)</Label>
                <Input
                  placeholder="href, src, data-id"
                  value={extraction.attribute || ""}
                  onChange={(e) =>
                    updateExtraction(index, {
                      attribute: e.target.value || undefined,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to extract text content
                </p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Extract Multiple</Label>
                  <p className="text-xs text-muted-foreground">
                    Extract array of all matching elements
                  </p>
                </div>
                <Switch
                  checked={extraction.multiple}
                  onCheckedChange={(checked) =>
                    updateExtraction(index, { multiple: checked })
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
