// src/app/(main)/components/(workflows)/editor/dialog/ClickElementConfig.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Code,
  MousePointer,
  AlertCircle,
  InfoIcon,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NodeConfigGrid, OutputColumn } from "../../NodeConfigDialog";
import type {
  WorkflowNode,
  ClickElementNodeData,
} from "@/lib/types/workflow-nodes.types";
import { ClickElementDataSchema } from "@/lib/types/workflow-nodes.types";
import { toast } from "sonner";

interface ClickElementConfigProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<ClickElementNodeData>) => void;
  outputData?: any;
}

export function ClickElementConfig({
  node,
  onUpdate,
  outputData,
}: ClickElementConfigProps) {
  const [formData, setFormData] = useState<ClickElementNodeData>(
    node.data as ClickElementNodeData
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [activeTab, setActiveTab] = useState<
    "parameters" | "settings" | "docs"
  >("parameters");

  useEffect(() => {
    setFormData(node.data as ClickElementNodeData);
  }, [node]);

  const handleChange = <K extends keyof ClickElementNodeData>(
    key: K,
    value: ClickElementNodeData[K]
  ) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);

    // Clear validation error
    if (validationErrors[key as string]) {
      setValidationErrors((prev) => {
        const errors = { ...prev };
        delete errors[key as string];
        return errors;
      });
    }

    // Auto-save on change (debounced in real implementation)
    try {
      const validated = ClickElementDataSchema.parse(updated);
      onUpdate(validated);
    } catch (error: any) {
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleManualSave = () => {
    try {
      const validated = ClickElementDataSchema.parse(formData);
      onUpdate(validated);
      setValidationErrors({});
      toast.success("Configuration saved successfully");
    } catch (error: any) {
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
        toast.error("Please fix validation errors");
      }
    }
  };

  return (
    <NodeConfigGrid layout="output-only">
      {/* ========== LEFT/CENTER: CONFIGURATION COLUMN ========== */}
      <div className="col-span-8 bg-[#1e1e1e] overflow-y-auto">
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#2a2a2a] mb-6">
            <button
              onClick={() => setActiveTab("parameters")}
              className={`pb-3 border-b-2 font-medium transition-colors ${
                activeTab === "parameters"
                  ? "border-[#ff6b6b] text-[#ff6b6b]"
                  : "border-transparent text-[#919298] hover:text-white"
              }`}
            >
              Parameters
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 border-b-2 font-medium transition-colors ${
                activeTab === "settings"
                  ? "border-[#ff6b6b] text-[#ff6b6b]"
                  : "border-transparent text-[#919298] hover:text-white"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`pb-3 border-b-2 font-medium transition-colors flex items-center gap-1 ${
                activeTab === "docs"
                  ? "border-[#ff6b6b] text-[#ff6b6b]"
                  : "border-transparent text-[#919298] hover:text-white"
              }`}
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-[#2d2d4a] border border-[#3d3d5a] rounded-lg flex gap-3">
            <InfoIcon className="w-5 h-5 text-[#818cf8] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-white">
                Tip: Learn selector strategies with our{" "}
                <a href="#" className="text-[#818cf8] underline">
                  selector guide
                </a>{" "}
                or see an{" "}
                <a href="#" className="text-[#818cf8] underline">
                  example workflow
                </a>
              </p>
            </div>
            <button className="text-[#919298] hover:text-white ml-auto">
              ×
            </button>
          </div>

          {/* ========== PARAMETERS TAB ========== */}
          {activeTab === "parameters" && (
            <div className="space-y-6">
              {/* Element Selector */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="selector" className="text-white text-sm">
                    Element Selector
                    <span className="text-red-400 ml-1">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-[#606060] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="max-w-xs bg-[#1e1e1e] border-[#2a2a2a]"
                      >
                        <p className="text-xs text-white mb-2">
                          CSS selector, XPath, text content, or ARIA label
                        </p>
                        <div className="mt-2 pt-2 border-t border-[#3a3a3a] text-xs text-[#919298]">
                          <div className="font-semibold mb-1">Examples:</div>
                          <code className="block mt-1 text-primary">
                            button.submit
                          </code>
                          <code className="block text-primary">
                            //button[@type="submit"]
                          </code>
                          <code className="block text-primary">
                            [aria-label="Submit"]
                          </code>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="selector"
                    value={formData.selector}
                    onChange={(e) => handleChange("selector", e.target.value)}
                    placeholder='e.g., button.submit or //button[@type="submit"]'
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#606060] pl-9"
                  />
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#606060]" />
                </div>
                {validationErrors.selector && (
                  <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1.5 rounded border border-red-500/30 mt-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>{validationErrors.selector}</span>
                  </div>
                )}
              </div>

              {/* Selector Type */}
              <div>
                <Label
                  htmlFor="selectorType"
                  className="text-white text-sm mb-2 block"
                >
                  Selector Type
                </Label>
                <Select
                  value={formData.selectorType}
                  onValueChange={(value: any) =>
                    handleChange("selectorType", value)
                  }
                >
                  <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                    <SelectItem value="css">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs"
                        >
                          CSS
                        </Badge>
                        <span>CSS Selector</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="xpath">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs"
                        >
                          XPath
                        </Badge>
                        <span>XPath Expression</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-400 border-green-500/30 text-xs"
                        >
                          Text
                        </Badge>
                        <span>Text Content</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="aria">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs"
                        >
                          ARIA
                        </Badge>
                        <span>ARIA Label</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#919298] mt-1">
                  How the selector should be interpreted
                </p>
              </div>

              {/* Click Type */}
              <div>
                <Label
                  htmlFor="clickType"
                  className="text-white text-sm mb-2 block"
                >
                  Click Type
                </Label>
                <Select
                  value={formData.clickType}
                  onValueChange={(value: any) =>
                    handleChange("clickType", value)
                  }
                >
                  <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                    <SelectItem value="single">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-[#919298]" />
                        <span>Single Click</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="double">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-[#919298]" />
                        <span>Double Click</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="right">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-[#919298]" />
                        <span>Right Click (Context Menu)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wait Timeout */}
              <div>
                <Label
                  htmlFor="waitTimeout"
                  className="text-white text-sm mb-2 block"
                >
                  Wait Timeout (milliseconds)
                </Label>
                <Input
                  id="waitTimeout"
                  type="number"
                  min={0}
                  max={60000}
                  step={100}
                  value={formData.waitTimeout}
                  onChange={(e) =>
                    handleChange("waitTimeout", parseInt(e.target.value) || 0)
                  }
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
                <p className="text-xs text-[#919298] mt-1">
                  Maximum time to wait for element (0-60000ms)
                </p>
              </div>
            </div>
          )}

          {/* ========== SETTINGS TAB ========== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Wait For Element */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label
                    htmlFor="waitForElement"
                    className="text-white text-sm"
                  >
                    Wait for element
                  </Label>
                  <p className="text-xs text-[#919298] mt-1">
                    Wait until element is visible before clicking
                  </p>
                </div>
                <Switch
                  id="waitForElement"
                  checked={formData.waitForElement}
                  onCheckedChange={(checked) =>
                    handleChange("waitForElement", checked)
                  }
                />
              </div>

              {/* Scroll Into View */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label
                    htmlFor="scrollIntoView"
                    className="text-white text-sm"
                  >
                    Scroll into view
                  </Label>
                  <p className="text-xs text-[#919298] mt-1">
                    Automatically scroll element into viewport before clicking
                  </p>
                </div>
                <Switch
                  id="scrollIntoView"
                  checked={formData.scrollIntoView}
                  onCheckedChange={(checked) =>
                    handleChange("scrollIntoView", checked)
                  }
                />
              </div>

              {/* Force Click */}
              <div className="flex items-center justify-between py-2 border-t border-[#2a2a2a] pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="forceClick" className="text-white text-sm">
                      Force click
                    </Label>
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-400 border-red-500/30 text-xs"
                    >
                      Caution
                    </Badge>
                  </div>
                  <p className="text-xs text-[#919298] mt-1">
                    Click even if element is hidden or disabled (bypass
                    visibility checks)
                  </p>
                </div>
                <Switch
                  id="forceClick"
                  checked={formData.forceClick}
                  onCheckedChange={(checked) =>
                    handleChange("forceClick", checked)
                  }
                />
              </div>

              {/* Options Section */}
              <div className="pt-4 border-t border-[#2a2a2a]">
                <Label className="text-white text-sm mb-3 block">
                  Advanced Options
                </Label>
                <div className="text-sm text-[#919298] mb-3">
                  No additional options configured
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                >
                  Add Custom Option
                </Button>
              </div>
            </div>
          )}

          {/* ========== DOCS TAB ========== */}
          {activeTab === "docs" && (
            <div className="space-y-6">
              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">
                  Click Element Node
                </h3>
                <p className="text-sm text-[#919298] mb-4">
                  Clicks on page elements using various selector strategies
                  (CSS, XPath, text, ARIA).
                </p>

                <h4 className="text-white text-sm font-semibold mb-2">
                  Selector Strategies
                </h4>
                <ul className="space-y-2 text-sm text-[#919298]">
                  <li className="flex items-start gap-2">
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                      CSS
                    </Badge>
                    <span>
                      Standard CSS selectors (e.g.,{" "}
                      <code className="text-primary">.btn-submit</code>)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                      XPath
                    </Badge>
                    <span>
                      XPath expressions (e.g.,{" "}
                      <code className="text-primary">
                        //button[@id='submit']
                      </code>
                      )
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                      Text
                    </Badge>
                    <span>Exact or partial text match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                      ARIA
                    </Badge>
                    <span>ARIA labels for accessibility</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
                  <h4 className="text-white text-sm font-semibold mb-2">
                    Example Usage
                  </h4>
                  <pre className="bg-[#1e1e1e] p-3 rounded text-xs text-[#919298] font-mono overflow-x-auto">
                    {`// Click submit button by CSS class
selector: "button.submit"
selectorType: "css"

// Click by XPath
selector: "//button[@type='submit']"
selectorType: "xpath"

// Click by text content
selector: "Submit Form"
selectorType: "text"`}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                  onClick={() =>
                    window.open(
                      "https://docs.example.com/nodes/click-element",
                      "_blank"
                    )
                  }
                >
                  View Full Docs
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                  onClick={() =>
                    window.open("https://docs.example.com/selectors", "_blank")
                  }
                >
                  Selector Guide
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== RIGHT: OUTPUT COLUMN ========== */}
      <OutputColumn>
        {outputData ? (
          <div className="space-y-4">
            <div className="text-xs text-[#919298] mb-2">Output Data</div>
            <pre className="bg-[#0d0d0d] border border-[#2a2a2a] rounded p-4 text-xs text-green-400 font-mono overflow-x-auto">
              {JSON.stringify(outputData, null, 2)}
            </pre>

            {outputData.screenshot && (
              <div className="mt-4">
                <div className="text-xs text-[#919298] mb-2">
                  Screenshot (Base64)
                </div>
                <img
                  src={`data:image/png;base64,${outputData.screenshot}`}
                  alt="Click result"
                  className="w-full rounded border border-[#2a2a2a]"
                />
              </div>
            )}
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
                <path
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
