"use client";

import { memo, useMemo } from "react";
import { NodeProps, Position } from "reactflow";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { OpenURLNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";
import { Badge } from "@/components/ui/badge";

export const OpenURLNode = memo((props: NodeProps<OpenURLNodeData>) => {
  const { data } = props;

  // Validate URL and show status
  const urlStatus = useMemo(() => {
    if (!data.url || data.url.trim().length === 0) {
      return {
        valid: false,
        message: "URL required",
        icon: AlertCircle,
        color: "#ef4444",
      };
    }

    try {
      const url = new URL(data.url);
      // Check if protocol is http/https
      if (!["http:", "https:"].includes(url.protocol)) {
        return {
          valid: false,
          message: "Only HTTP/HTTPS allowed",
          icon: AlertCircle,
          color: "#f59e0b",
        };
      }
      return {
        valid: true,
        message: "Valid URL",
        icon: CheckCircle2,
        color: "#22c55e",
      };
    } catch {
      return {
        valid: false,
        message: "Invalid URL format",
        icon: AlertCircle,
        color: "#ef4444",
      };
    }
  }, [data.url]);

  // Extract domain for subtitle
  const domain = useMemo(() => {
    if (!data.url) return "No URL set";
    try {
      const url = new URL(data.url);
      return url.hostname;
    } catch {
      return "Invalid URL";
    }
  }, [data.url]);

  // Calculate estimated load time badge
  const estimatedLoadTime = useMemo(() => {
    const timeout = data.timeout || 30000;
    return timeout >= 60000
      ? `${(timeout / 60000).toFixed(1)}m`
      : timeout >= 1000
      ? `${(timeout / 1000).toFixed(0)}s`
      : `${timeout}ms`;
  }, [data.timeout]);

  const config: BaseNodeConfig = {
    icon: "ExternalLink",
    iconColor: urlStatus.color,
    nodeName: "Open URL",
    subtitle: domain,
    description: data.url || "Configure URL to navigate",
    executionState: data.executionState,
    enabled: data.enabled,
    errors: data.errors,
    warnings: data.warnings ? [data.warnings] : undefined,
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: { left: -7 },
        label: "Previous step",
        color: urlStatus.color,
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7 },
        label: "Page loaded",
        color: urlStatus.color,
      },
    ],
    showPowerToggle: true,
    badges: [
      {
        content: estimatedLoadTime,
        variant: "outline",
        tooltip: `Timeout: ${data.timeout || 30000}ms`,
        icon:
          data.executionState === "running" ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
          ) : undefined,
      },
    ],
    footerContent: (
      <div className="space-y-2">
        {/* URL Status Indicator */}
        <div className="flex items-center gap-2">
          <urlStatus.icon
            className="w-3 h-3"
            style={{ color: urlStatus.color }}
          />
          <span className="text-xs" style={{ color: urlStatus.color }}>
            {urlStatus.message}
          </span>
        </div>

        {/* Wait for Selector Badge */}
        {data.waitForSelector && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Wait: {data.waitForSelector}
            </Badge>
          </div>
        )}

        {/* Custom Viewport */}
        {data.viewport && (
          <div className="text-xs text-slate-500">
            Viewport: {data.viewport.width}x{data.viewport.height}
          </div>
        )}

        {/* User Agent Override */}
        {data.userAgent && (
          <div
            className="text-xs text-slate-500 truncate"
            title={data.userAgent}
          >
            UA: {data.userAgent.slice(0, 30)}...
          </div>
        )}
      </div>
    ),
  };

  return <BaseNode {...props} config={config} />;
});

OpenURLNode.displayName = "OpenURLNode";
