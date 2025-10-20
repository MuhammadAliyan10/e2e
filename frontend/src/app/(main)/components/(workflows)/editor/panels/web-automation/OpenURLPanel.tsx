"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type {
  WorkflowNode,
  OpenURLNodeData,
} from "@/lib/types/workflow-nodes.types";

interface OpenURLPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<OpenURLNodeData>) => void;
}

// Common viewport presets
const VIEWPORT_PRESETS = [
  { label: "Desktop (1920x1080)", width: 1920, height: 1080 },
  { label: "Laptop (1366x768)", width: 1366, height: 768 },
  { label: "Tablet (768x1024)", width: 768, height: 1024 },
  { label: "Mobile (375x667)", width: 375, height: 667 },
  { label: "Custom", width: 0, height: 0 },
] as const;

// Common user agents
const USER_AGENTS = [
  {
    label: "Chrome (Windows)",
    value:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
  {
    label: "Safari (Mac)",
    value:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  },
  {
    label: "Mobile Chrome",
    value:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36",
  },
  {
    label: "Mobile Safari",
    value:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  { label: "Default (Browser)", value: "" },
] as const;

export function OpenURLPanel({ node, onUpdate }: OpenURLPanelProps) {
  const data = node.data as OpenURLNodeData;

  // Local state for URL validation
  const [urlInput, setUrlInput] = useState(data.url || "");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced URL validation
  useEffect(() => {
    if (!urlInput) {
      setUrlError("URL is required");
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      try {
        const url = new URL(urlInput);
        if (!["http:", "https:"].includes(url.protocol)) {
          setUrlError("Only HTTP and HTTPS protocols are supported");
        } else {
          setUrlError(null);
          onUpdate({ url: urlInput });
        }
      } catch {
        setUrlError("Invalid URL format (must include http:// or https://)");
      }
      setIsValidating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [urlInput, onUpdate]);

  // Handle viewport preset selection
  const handleViewportPreset = useCallback(
    (preset: (typeof VIEWPORT_PRESETS)[number]) => {
      if (preset.width === 0) {
        // Custom - don't update, let user input manually
        return;
      }
      onUpdate({
        viewport: { width: preset.width, height: preset.height },
      });
    },
    [onUpdate]
  );

  // Current viewport preset
  const currentViewportPreset =
    VIEWPORT_PRESETS.find(
      (p) =>
        p.width === data.viewport?.width && p.height === data.viewport?.height
    ) || VIEWPORT_PRESETS[VIEWPORT_PRESETS.length - 1];

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-semibold">
          Target URL *
        </Label>
        <div className="relative">
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className={urlError ? "border-red-500 pr-10" : "pr-10"}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : urlError ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : urlInput ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        </div>
        {urlError && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {urlError}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          The web page to navigate to. Supports variable interpolation: {"{{"}{" "}
          url {"}}"}.
        </p>
      </div>

      <Separator />

      {/* Wait Conditions */}
      <Accordion type="single" collapsible defaultValue="wait-conditions">
        <AccordionItem value="wait-conditions" className="border-none">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Wait Conditions
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {/* Wait for Selector */}
            <div className="space-y-2">
              <Label htmlFor="waitForSelector" className="text-sm">
                Wait for Selector (Optional)
              </Label>
              <Input
                id="waitForSelector"
                placeholder="#main-content, .loaded, [data-ready]"
                value={data.waitForSelector || ""}
                onChange={(e) =>
                  onUpdate({ waitForSelector: e.target.value || undefined })
                }
              />
              <p className="text-xs text-muted-foreground">
                CSS selector to wait for before continuing. Ensures page is
                fully loaded.
              </p>
            </div>

            {/* Wait for Navigation */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="waitForNavigation" className="text-sm">
                  Wait for Navigation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Wait for network idle after navigation
                </p>
              </div>
              <Switch
                id="waitForNavigation"
                checked={data.waitForNavigation !== false}
                onCheckedChange={(checked) =>
                  onUpdate({ waitForNavigation: checked })
                }
              />
            </div>

            {/* Timeout */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeout" className="text-sm">
                  Timeout
                </Label>
                <Badge variant="outline" className="text-xs">
                  {data.timeout || 30000}ms
                </Badge>
              </div>
              <Slider
                id="timeout"
                min={5000}
                max={120000}
                step={5000}
                value={[data.timeout || 30000]}
                onValueChange={([value]) => onUpdate({ timeout: value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5s</span>
                <span>30s</span>
                <span>60s</span>
                <span>2m</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Browser Settings */}
      <Accordion type="single" collapsible>
        <AccordionItem value="browser-settings" className="border-none">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Browser Settings
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {/* Viewport */}
            <div className="space-y-2">
              <Label htmlFor="viewport-preset" className="text-sm">
                Viewport Size
              </Label>
              <Select
                value={currentViewportPreset.label}
                onValueChange={(value) => {
                  const preset = VIEWPORT_PRESETS.find(
                    (p) => p.label === value
                  );
                  if (preset) handleViewportPreset(preset);
                }}
              >
                <SelectTrigger id="viewport-preset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIEWPORT_PRESETS.map((preset) => (
                    <SelectItem key={preset.label} value={preset.label}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Custom Viewport Input */}
              {currentViewportPreset.label === "Custom" && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="viewport-width" className="text-xs">
                      Width
                    </Label>
                    <Input
                      id="viewport-width"
                      type="number"
                      min="320"
                      max="3840"
                      placeholder="1920"
                      value={data.viewport?.width || ""}
                      onChange={(e) =>
                        onUpdate({
                          viewport: {
                            width: parseInt(e.target.value) || 1920,
                            height: data.viewport?.height || 1080,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="viewport-height" className="text-xs">
                      Height
                    </Label>
                    <Input
                      id="viewport-height"
                      type="number"
                      min="240"
                      max="2160"
                      placeholder="1080"
                      value={data.viewport?.height || ""}
                      onChange={(e) =>
                        onUpdate({
                          viewport: {
                            width: data.viewport?.width || 1920,
                            height: parseInt(e.target.value) || 1080,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Agent */}
            <div className="space-y-2">
              <Label htmlFor="user-agent" className="text-sm">
                User Agent
              </Label>
              <Select
                value={data.userAgent || ""}
                onValueChange={(value) =>
                  onUpdate({ userAgent: value || undefined })
                }
              >
                <SelectTrigger id="user-agent">
                  <SelectValue placeholder="Default (Browser)" />
                </SelectTrigger>
                <SelectContent>
                  {USER_AGENTS.map((ua) => (
                    <SelectItem key={ua.label} value={ua.value}>
                      {ua.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {data.userAgent && (
                <p
                  className="text-xs text-muted-foreground font-mono truncate"
                  title={data.userAgent}
                >
                  {data.userAgent}
                </p>
              )}
            </div>

            {/* Referer */}
            <div className="space-y-2">
              <Label htmlFor="referer" className="text-sm">
                Referer (Optional)
              </Label>
              <Input
                id="referer"
                type="url"
                placeholder="https://referrer-site.com"
                value={data.referer || ""}
                onChange={(e) =>
                  onUpdate({ referer: e.target.value || undefined })
                }
              />
              <p className="text-xs text-muted-foreground">
                Custom HTTP Referer header. Useful for bypassing referer checks.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Tip:</strong> Use variables like {"{{"} previousUrl {"}}"} in
          the URL field to create dynamic workflows. The page will wait for
          network idle before proceeding.
        </AlertDescription>
      </Alert>

      {/* Preview Info */}
      {!urlError && urlInput && (
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-300">
            Navigation Preview
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>URL:</span>
              <span className="text-blue-400 truncate ml-2" title={urlInput}>
                {new URL(urlInput).hostname}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Timeout:</span>
              <span className="text-slate-300">{data.timeout || 30000}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Wait for selector:</span>
              <span className="text-slate-300">
                {data.waitForSelector || "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Viewport:</span>
              <span className="text-slate-300">
                {data.viewport
                  ? `${data.viewport.width}x${data.viewport.height}`
                  : "Default"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
