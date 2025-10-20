"use client";

import React, { memo, ReactNode, useState, useCallback, useMemo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Plus,
  Check,
  Power,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getNodeIcon } from "@/lib/utils/get-node-icon";
import { EDGE_COLOR, NODE_BG_COLOR } from "@/lib/utils/node-registry";

// ===== TYPES =====

export type ExecutionState =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "warning"
  | "skipped";

export interface HandleConfig {
  id: string;
  type: "source" | "target";
  position: Position;
  style?: React.CSSProperties;
  className?: string;
  isConnectable?: boolean;
  label?: string;
  color?: string;
}

export interface SubNodeConfig {
  id: string;
  label: string;
  icon?: ReactNode;
  subtitle?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
  customRender?: (config: SubNodeConfig) => ReactNode;
  disabled?: boolean;
}

export interface NodeBadgeConfig {
  content: string | number;
  variant?: "default" | "outline" | "secondary" | "destructive" | "success";
  className?: string;
  icon?: ReactNode;
  tooltip?: string;
}

export interface BaseNodeConfig {
  // Content
  icon: string | ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  nodeName: string;
  subtitle?: string;
  description?: string;

  // State
  executionState?: ExecutionState;
  enabled?: boolean;
  progress?: number;

  // Layout (NO DEFAULT STYLES - must be set by individual nodes)
  width?: number | string;
  minWidth?: number;
  height?: number | string;
  minHeight?: number;
  borderRadius?: string;
  padding?: string;

  // Handles
  handles?: HandleConfig[];
  hasDefaultHandles?: boolean;
  hideHandlesOnHover?: boolean;

  // Badges & Counters
  badges?: NodeBadgeConfig[];
  itemCount?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;

  // Sub-Nodes
  subNodes?: SubNodeConfig[];
  showSubNodes?: boolean;
  subNodeLayout?: "vertical" | "horizontal" | "grid";
  onToggleSubNodes?: (show: boolean) => void;
  maxVisibleSubNodes?: number;

  // Custom Content
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  customContent?: ReactNode;
  errorContent?: ReactNode;

  // Styling (NO DEFAULTS - must be explicit)
  className?: string;
  contentClassName?: string;
  borderColor?: string;
  borderWidth?: number;
  hoverEffect?: boolean;
  glowEffect?: boolean;

  // Interactions
  showPowerToggle?: boolean;
  onPowerToggle?: (enabled: boolean) => void;
  onNodeClick?: (e: React.MouseEvent) => void;
  onNodeDoubleClick?: (e: React.MouseEvent) => void;

  // Accessibility
  ariaLabel?: string;
  role?: string;

  // Validation & Errors
  errors?: string[];
  warnings?: string[];
}

interface BaseNodeProps extends NodeProps {
  config: BaseNodeConfig;
}

// ===== CONSTANTS =====

const STATE_COLORS: Record<ExecutionState, string> = {
  idle: "#64748b",
  running: "#3b82f6",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  skipped: "#94a3b8",
};

const STATE_BORDER_GLOW: Record<ExecutionState, string> = {
  idle: "none",
  running: "0 0 12px rgba(59, 130, 246, 0.5)",
  success: "0 0 12px rgba(34, 197, 94, 0.5)",
  error: "0 0 12px rgba(239, 68, 68, 0.5)",
  warning: "0 0 12px rgba(245, 158, 11, 0.5)",
  skipped: "none",
};

// ===== MAIN COMPONENT =====

export const BaseNode = memo(({ data, selected, config }: BaseNodeProps) => {
  const {
    icon,
    iconColor = EDGE_COLOR,
    iconBgColor,
    nodeName,
    subtitle,
    description,
    executionState = "idle",
    enabled = data?.enabled !== false,
    progress,
    // NO DEFAULTS - nodes must provide their own styling
    width,
    minWidth,
    height,
    minHeight,
    borderRadius,
    padding,
    handles = [],
    hasDefaultHandles = false,
    hideHandlesOnHover = false,
    badges = [],
    itemCount,
    showAddButton = false,
    onAddClick,
    subNodes = [],
    showSubNodes: initialShowSubNodes = true,
    subNodeLayout = "vertical",
    onToggleSubNodes,
    maxVisibleSubNodes,
    headerContent,
    footerContent,
    customContent,
    errorContent,
    className,
    contentClassName,
    borderColor: customBorderColor,
    borderWidth,
    hoverEffect = false,
    glowEffect = false,
    showPowerToggle = false,
    onPowerToggle,
    onNodeClick,
    onNodeDoubleClick,
    ariaLabel,
    role = "article",
    errors = data?.errors || [],
    warnings = data?.warnings || [],
  } = config;

  // State
  const [showSubNodes, setShowSubNodes] = useState(initialShowSubNodes);
  const [isHovered, setIsHovered] = useState(false);

  // Icon resolution
  const IconComponent = useMemo(
    () => (typeof icon === "string" ? getNodeIcon(icon) : null),
    [icon]
  );

  // Border color logic
  const borderColor = useMemo(() => {
    if (customBorderColor) return customBorderColor;
    if (errors.length > 0) return STATE_COLORS.error;
    if (executionState === "success") return STATE_COLORS.success;
    if (executionState === "error") return STATE_COLORS.error;
    if (executionState === "running") return STATE_COLORS.running;
    if (selected) return "#3b82f6";
    return EDGE_COLOR;
  }, [customBorderColor, errors, executionState, selected]);

  // Box shadow (glow effect)
  const boxShadow = useMemo(() => {
    if (!glowEffect) return "none";
    if (executionState === "running" || executionState === "error") {
      return STATE_BORDER_GLOW[executionState];
    }
    if (selected) return "0 0 12px rgba(59, 130, 246, 0.4)";
    return "none";
  }, [glowEffect, executionState, selected]);

  // Handlers
  const handleToggleSubNodes = useCallback(() => {
    const newState = !showSubNodes;
    setShowSubNodes(newState);
    onToggleSubNodes?.(newState);
  }, [showSubNodes, onToggleSubNodes]);

  const handlePowerToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onPowerToggle?.(!enabled);
    },
    [enabled, onPowerToggle]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Visible sub-nodes
  const visibleSubNodes = useMemo(() => {
    if (!maxVisibleSubNodes || showSubNodes) return subNodes;
    return subNodes.slice(0, maxVisibleSubNodes);
  }, [subNodes, maxVisibleSubNodes, showSubNodes]);

  const hasMoreSubNodes =
    subNodes.length > (maxVisibleSubNodes || 0) && !showSubNodes;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || nodeName}
      role={role}
    >
      {/* Main Node */}
      <div
        className={cn(
          "relative transition-all duration-200",
          hoverEffect && "hover:scale-[1.02]",
          !enabled && "opacity-50 cursor-not-allowed",
          enabled && "cursor-pointer"
        )}
        style={{
          backgroundColor: NODE_BG_COLOR,
          borderColor,
          borderWidth: borderWidth ? `${borderWidth}px` : undefined,
          borderStyle: borderWidth ? "solid" : undefined,
          borderRadius,
          width,
          minWidth,
          height,
          minHeight,
          boxShadow,
        }}
        onClick={enabled ? onNodeClick : undefined}
        onDoubleClick={enabled ? onNodeDoubleClick : undefined}
      >
        {/* Progress Bar */}
        {executionState === "running" && progress !== undefined && (
          <div
            className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: progress >= 100 ? borderRadius : 0,
            }}
          />
        )}

        {/* Default Handles */}
        {hasDefaultHandles &&
          (!hideHandlesOnHover || isHovered || selected) && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Handle
                      type="target"
                      position={Position.Left}
                      className="!w-3 !h-3 !border-2 !border-[#1e1e1e] transition-opacity"
                      style={{
                        left: -7,
                        backgroundColor: EDGE_COLOR,
                        borderRadius: "50%",
                        opacity: hideHandlesOnHover && !isHovered ? 0 : 1,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Input
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Handle
                      type="source"
                      position={Position.Right}
                      className="!w-3 !h-3 !border-2 !border-[#1e1e1e] transition-opacity"
                      style={{
                        right: -7,
                        backgroundColor: iconColor,
                        borderRadius: "50%",
                        opacity: hideHandlesOnHover && !isHovered ? 0 : 1,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    Output
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

        {/* Custom Handles */}
        {handles.map((handle) => (
          <TooltipProvider key={handle.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Handle
                  id={handle.id}
                  type={handle.type}
                  position={handle.position}
                  className={cn(
                    "!w-3 !h-3 !border-2 !border-[#1e1e1e]",
                    handle.className
                  )}
                  style={{
                    backgroundColor: handle.color || iconColor,
                    borderRadius: "50%",
                    ...handle.style,
                  }}
                  isConnectable={handle.isConnectable !== false}
                />
              </TooltipTrigger>
              {handle.label && (
                <TooltipContent
                  side={handle.position === Position.Left ? "left" : "right"}
                  className="text-xs"
                >
                  {handle.label}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Content */}
        {customContent ? (
          <div style={{ padding }}>{customContent}</div>
        ) : (
          <div style={{ padding }}>
            {headerContent && <div className="mb-2">{headerContent}</div>}

            {/* Main Content */}
            <div className={cn("flex items-start gap-3", contentClassName)}>
              {/* Icon */}
              <div
                className="rounded-lg flex items-center justify-center shrink-0 transition-transform"
                style={{
                  backgroundColor: iconBgColor || `${iconColor}15`,
                  width: 40,
                  height: 40,
                }}
              >
                {IconComponent ? (
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: iconColor }}
                  />
                ) : (
                  icon
                )}
              </div>

              {/* Label & Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-sm truncate">
                    {nodeName}
                  </span>
                  {executionState === "success" && (
                    <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  )}
                  {errors.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs font-semibold mb-1">Errors:</p>
                          <ul className="text-xs space-y-0.5">
                            {errors
                              .slice(0, 3)
                              .map((err: string, i: number) => (
                                <li key={i}>• {err}</li>
                              ))}
                            {errors.length > 3 && (
                              <li>• +{errors.length - 3} more</li>
                            )}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {subtitle && (
                  <p className="text-xs text-slate-400 truncate mb-1">
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                {showPowerToggle && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handlePowerToggle}
                          className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                          aria-label={enabled ? "Disable node" : "Enable node"}
                        >
                          <Power
                            className={cn(
                              "w-3.5 h-3.5 transition-colors",
                              enabled ? "text-green-400" : "text-slate-600"
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {enabled ? "Disable" : "Enable"} {nodeName}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {subNodes.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleToggleSubNodes}
                          className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                          aria-label={showSubNodes ? "Collapse" : "Expand"}
                        >
                          {showSubNodes ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showSubNodes ? "Collapse" : "Expand"} (
                        {subNodes.length})
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {executionState === "error" && errorContent && (
              <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                {errorContent}
              </div>
            )}

            {footerContent && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                {footerContent}
              </div>
            )}
          </div>
        )}

        {/* Execution State Indicator */}
        <div
          className={cn(
            "absolute bottom-2 left-2 w-2 h-2 rounded-full transition-all",
            executionState === "running" && "animate-pulse"
          )}
          style={{ backgroundColor: STATE_COLORS[executionState] }}
          title={
            executionState.charAt(0).toUpperCase() + executionState.slice(1)
          }
        />
      </div>

      {/* Right Side: Badges + Buttons */}
      {(itemCount !== undefined || badges.length > 0 || showAddButton) && (
        <div className="absolute -right-2 top-0 translate-x-full flex flex-col items-start gap-1.5 pl-2">
          {itemCount !== undefined && (
            <Badge
              variant="outline"
              className="bg-[#1e1e1e] border-slate-600 text-slate-300 text-xs h-5 px-2"
            >
              {itemCount}
            </Badge>
          )}

          {badges.map((badge, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={badge.variant || "outline"}
                    className={cn(
                      "bg-[#1e1e1e] border-slate-600 text-slate-300 text-xs h-5 px-2",
                      badge.className
                    )}
                  >
                    {badge.icon}
                    {badge.content}
                  </Badge>
                </TooltipTrigger>
                {badge.tooltip && (
                  <TooltipContent>{badge.tooltip}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}

          {showAddButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onAddClick}
                    className="w-6 h-6 rounded-md bg-slate-700 hover:bg-slate-600 border border-slate-500 flex items-center justify-center transition-colors"
                    aria-label="Add connection"
                  >
                    <Plus className="w-4 h-4 text-slate-300" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add new output</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Sub-Nodes */}
      {visibleSubNodes.length > 0 && showSubNodes && (
        <div
          className={cn(
            "mt-3 pl-8",
            subNodeLayout === "vertical" && "space-y-2",
            subNodeLayout === "horizontal" && "flex gap-2 flex-wrap",
            subNodeLayout === "grid" && "grid grid-cols-2 gap-2"
          )}
        >
          {visibleSubNodes.map((subNode) => (
            <SubNodeRenderer
              key={subNode.id}
              config={subNode}
              parentIconColor={iconColor}
            />
          ))}

          {hasMoreSubNodes && (
            <button
              onClick={handleToggleSubNodes}
              className="text-xs text-slate-400 hover:text-slate-300 underline"
            >
              + {subNodes.length - (maxVisibleSubNodes || 0)} more
            </button>
          )}
        </div>
      )}
    </div>
  );
});

BaseNode.displayName = "BaseNode";

// ===== SUB-NODE RENDERER =====

interface SubNodeRendererProps {
  config: SubNodeConfig;
  parentIconColor: string;
}

const SubNodeRenderer = memo(
  ({ config, parentIconColor }: SubNodeRendererProps) => {
    if (config.customRender) {
      return <>{config.customRender(config)}</>;
    }

    return (
      <div className="relative group">
        <div className="absolute -left-8 top-1/2 w-8 h-px bg-slate-600 transition-colors group-hover:bg-slate-500" />
        <div className="absolute -left-8 top-0 w-px h-1/2 bg-slate-600 transition-colors group-hover:bg-slate-500" />

        <div
          className={cn(
            "relative bg-[#1e1e1e] border-2 border-slate-600 rounded-lg px-3 py-2",
            "flex items-center gap-2 transition-all duration-200",
            config.disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-slate-500 hover:scale-[1.02]",
            config.className
          )}
          onClick={config.disabled ? undefined : config.onClick}
        >
          {config.icon && (
            <span className="text-base shrink-0">{config.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm text-white font-medium truncate block">
              {config.label}
            </span>
            {config.subtitle && (
              <p className="text-xs text-slate-400 truncate">
                {config.subtitle}
              </p>
            )}
          </div>
          {config.badge && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              {config.badge}
            </Badge>
          )}

          <Handle
            type="source"
            position={Position.Right}
            id={`sub-${config.id}`}
            className="!w-2.5 !h-2.5 !border-2 !border-[#1e1e1e]"
            style={{
              position: "absolute",
              right: -5,
              backgroundColor: parentIconColor,
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    );
  }
);

SubNodeRenderer.displayName = "SubNodeRenderer";
