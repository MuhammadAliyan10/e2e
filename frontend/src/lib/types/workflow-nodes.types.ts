// src/lib/types/workflow-nodes.types.ts
import type { Node, Edge, MarkerType } from "reactflow";
import { z } from "zod";

// ============ EXECUTION STATE ============
export const ExecutionState = z.enum([
  "idle",
  "running",
  "success",
  "error",
  "warning",
]);
export type ExecutionState = z.infer<typeof ExecutionState>;

// ============ BASE NODE DATA (SHARED BY ALL NODES) ============
export interface BaseNodeData {
  label: string;
  description?: string;
  enabled: boolean;
  executionState?: ExecutionState;
  errors?: string[];
  warnings?: string[];
  lastExecutedAt?: string | null;
  executionCount?: number;
  metadata?: Record<string, unknown>;
  retryCount?: number;

  // Runtime callbacks (injected by React Flow)
  onRun?: (nodeId: string) => Promise<void>;
  onUpdate?: (data: Partial<BaseNodeData>) => void;
  onDelete?: () => void;
  onConfigure?: () => void;
  onAddNode?: (sourceNodeId: string, sourceHandleId: string) => void;
}

// ============ TRIGGER NODE ============
export const OnClickTriggerDataSchema = z.object({
  label: z.string().default("Trigger"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),

  // Trigger-specific
  type: z.literal("manual").default("manual"),
  debounceMs: z.number().min(0).max(10000).default(500),
  customPayload: z.record(z.string(), z.unknown()).default({}),
  maxExecutions: z.number().min(1).nullable().default(null),
  logExecutions: z.boolean().default(true),
});

export type OnClickTriggerData = z.infer<typeof OnClickTriggerDataSchema> &
  BaseNodeData;

// ============ BROWSER AUTOMATION NODES ============

// 1. Open URL
export const OpenURLDataSchema = z.object({
  label: z.string().default("Open URL"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),

  // OpenURL-specific
  url: z.string().default(""),
  waitForNavigation: z.boolean().default(true),
  timeout: z.number().min(1000).max(120000).default(30000),
  userAgent: z.string().optional(),
  viewport: z
    .object({
      width: z.number().min(320).max(3840).default(1920),
      height: z.number().min(240).max(2160).default(1080),
    })
    .optional(),
});

export type OpenURLNodeData = z.infer<typeof OpenURLDataSchema> & BaseNodeData;

// 2. Click Element
export const ClickElementDataSchema = z.object({
  label: z.string().default("Click Element"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),

  // ClickElement-specific
  selector: z.string().default(""),
  selectorType: z.enum(["css", "xpath", "text", "aria"]).default("css"),
  clickType: z.enum(["single", "double", "right"]).default("single"),
  waitForElement: z.boolean().default(true),
  waitTimeout: z.number().min(0).max(60000).default(10000),
  scrollIntoView: z.boolean().default(true),
  forceClick: z.boolean().default(false),
  coordinates: z
    .object({
      x: z.number().min(0),
      y: z.number().min(0),
    })
    .optional(),
  modifiers: z.array(z.enum(["Alt", "Control", "Meta", "Shift"])).optional(),
});

export type ClickElementNodeData = z.infer<typeof ClickElementDataSchema> &
  BaseNodeData;

// 3. Fill Input
export const FillInputDataSchema = z.object({
  label: z.string().default("Fill Input"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),

  // FillInput-specific
  selector: z.string().default(""),
  value: z.string().default(""),
  clearFirst: z.boolean().default(true),
  pressEnter: z.boolean().default(false),
  delay: z.number().min(0).max(5000).default(0),
  validateInput: z.boolean().default(false),
});

export type FillInputNodeData = z.infer<typeof FillInputDataSchema> &
  BaseNodeData;

// 4. Select Dropdown
export const SelectDropdownDataSchema = z.object({
  label: z.string().default("Select Dropdown"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  value: z.string().default(""),
  selectBy: z.enum(["value", "label", "index"]).default("value"),
  waitForOptions: z.boolean().default(true),
});

export type SelectDropdownNodeData = z.infer<typeof SelectDropdownDataSchema> &
  BaseNodeData;

// 5. Upload File
export const UploadFileDataSchema = z.object({
  label: z.string().default("Upload File"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  filePath: z.string().default(""),
  fileSource: z.enum(["local", "url", "base64"]).default("local"),
  mimeType: z.string().optional(),
  waitForUpload: z.boolean().default(true),
});

export type UploadFileNodeData = z.infer<typeof UploadFileDataSchema> &
  BaseNodeData;

// 6. Download File
export const DownloadFileDataSchema = z.object({
  label: z.string().default("Download File"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().optional(),
  url: z.string().optional(),
  savePath: z.string().default("./downloads"),
  filename: z.string().optional(),
  overwrite: z.boolean().default(false),
  waitForDownload: z.boolean().default(true),
  timeout: z.number().min(1000).max(300000).default(60000),
});

export type DownloadFileNodeData = z.infer<typeof DownloadFileDataSchema> &
  BaseNodeData;

// 7. Wait For Element
export const WaitForElementDataSchema = z.object({
  label: z.string().default("Wait For Element"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  state: z
    .enum(["visible", "hidden", "attached", "detached"])
    .default("visible"),
  timeout: z.number().min(0).max(60000).default(10000),
  throwOnTimeout: z.boolean().default(true),
});

export type WaitForElementNodeData = z.infer<typeof WaitForElementDataSchema> &
  BaseNodeData;

// 8. Extract Text
export const ExtractTextDataSchema = z.object({
  label: z.string().default("Extract Text"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  attribute: z.enum(["text", "innerText", "innerHTML"]).default("text"),
  multiple: z.boolean().default(false),
  trim: z.boolean().default(true),
  regex: z.string().optional(),
});

export type ExtractTextNodeData = z.infer<typeof ExtractTextDataSchema> &
  BaseNodeData;

// 9. Extract Attribute
export const ExtractAttributeDataSchema = z.object({
  label: z.string().default("Extract Attribute"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  attribute: z.string().default("href"),
  multiple: z.boolean().default(false),
  fallback: z.string().optional(),
});

export type ExtractAttributeNodeData = z.infer<
  typeof ExtractAttributeDataSchema
> &
  BaseNodeData;

// 10. Take Screenshot
export const TakeScreenshotDataSchema = z.object({
  label: z.string().default("Take Screenshot"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  fullPage: z.boolean().default(false),
  selector: z.string().optional(),
  format: z.enum(["png", "jpeg"]).default("png"),
  quality: z.number().min(0).max(100).default(80),
  savePath: z.string().optional(),
  base64: z.boolean().default(false),
});

export type TakeScreenshotNodeData = z.infer<typeof TakeScreenshotDataSchema> &
  BaseNodeData;

// 11. Scroll To Element
export const ScrollToElementDataSchema = z.object({
  label: z.string().default("Scroll To Element"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().optional(),
  direction: z.enum(["up", "down", "left", "right"]).optional(),
  distance: z.number().min(0).optional(),
  behavior: z.enum(["auto", "smooth"]).default("smooth"),
});

export type ScrollToElementNodeData = z.infer<
  typeof ScrollToElementDataSchema
> &
  BaseNodeData;

// 12. Go Back
export const GoBackDataSchema = z.object({
  label: z.string().default("Go Back"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  waitForNavigation: z.boolean().default(true),
  timeout: z.number().min(1000).max(120000).default(30000),
});

export type GoBackNodeData = z.infer<typeof GoBackDataSchema> & BaseNodeData;

// 13. Go Forward
export const GoForwardDataSchema = z.object({
  label: z.string().default("Go Forward"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  waitForNavigation: z.boolean().default(true),
  timeout: z.number().min(1000).max(120000).default(30000),
});

export type GoForwardNodeData = z.infer<typeof GoForwardDataSchema> &
  BaseNodeData;

// 14. Hover Element
export const HoverElementDataSchema = z.object({
  label: z.string().default("Hover Element"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  selector: z.string().default(""),
  duration: z.number().min(0).max(10000).default(500),
});

export type HoverElementNodeData = z.infer<typeof HoverElementDataSchema> &
  BaseNodeData;

// 15. Drag And Drop
export const DragAndDropDataSchema = z.object({
  label: z.string().default("Drag & Drop"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  sourceSelector: z.string().default(""),
  targetSelector: z.string().default(""),
});

export type DragAndDropNodeData = z.infer<typeof DragAndDropDataSchema> &
  BaseNodeData;

// 16. Press Key
export const PressKeyDataSchema = z.object({
  label: z.string().default("Press Key"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  key: z.string().default("Enter"),
  modifiers: z.array(z.enum(["Alt", "Control", "Meta", "Shift"])).default([]),
});

export type PressKeyNodeData = z.infer<typeof PressKeyDataSchema> &
  BaseNodeData;

// 17. Execute JavaScript
export const ExecuteJavaScriptDataSchema = z.object({
  label: z.string().default("Execute JavaScript"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  script: z.string().default(""),
  returnValue: z.boolean().default(true),
});

export type ExecuteJavaScriptNodeData = z.infer<
  typeof ExecuteJavaScriptDataSchema
> &
  BaseNodeData;

// 18. Reload Page
export const ReloadPageDataSchema = z.object({
  label: z.string().default("Reload Page"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().default(0),
  hardReload: z.boolean().default(false),
});

export type ReloadPageNodeData = z.infer<typeof ReloadPageDataSchema> &
  BaseNodeData;

// ============ NODE TYPE UNION ============
export type NodeType =
  | "trigger"
  | "openURL"
  | "clickElement"
  | "fillInput"
  | "selectDropdown"
  | "uploadFile"
  | "downloadFile"
  | "waitForElement"
  | "extractText"
  | "extractAttribute"
  | "takeScreenshot"
  | "scrollToElement"
  | "goBack"
  | "goForward"
  | "hoverElement"
  | "dragAndDrop"
  | "pressKey"
  | "executeJavaScript"
  | "reloadPage";

export type WorkflowNodeData =
  | OnClickTriggerData
  | OpenURLNodeData
  | ClickElementNodeData
  | FillInputNodeData
  | SelectDropdownNodeData
  | UploadFileNodeData
  | DownloadFileNodeData
  | WaitForElementNodeData
  | ExtractTextNodeData
  | ExtractAttributeNodeData
  | TakeScreenshotNodeData
  | ScrollToElementNodeData
  | GoBackNodeData
  | GoForwardNodeData
  | HoverElementNodeData
  | DragAndDropNodeData
  | PressKeyNodeData
  | ExecuteJavaScriptNodeData
  | ReloadPageNodeData;

// ============ WORKFLOW TYPES ============
export interface WorkflowNode extends Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export type DataEdge = Edge & {
  type?: "custom" | "default";
  animated?: boolean;
  markerEnd?: {
    type: MarkerType;
    color?: string;
  };
  data?: {
    label?: string;
    payload?: unknown;
  };
};

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: DataEdge[];
  variables?: Record<string, unknown>;
  version: number;
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: "error" | "warning";
  message: string;
}

// ============ EXECUTION TYPES ============
export interface NodeExecutionPayload {
  nodeId: string;
  nodeType: NodeType;
  timestamp: string;
  executionId: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface NodeExecutionResult {
  nodeId: string;
  executionId: string;
  status: ExecutionState;
  data?: Record<string, unknown>;
  errors?: string[];
  warnings?: string[];
  executedAt: string;
  durationMs: number;
  outputData?: Record<string, unknown>;
  nextNodes?: string[];
}

export interface ClickElementResult {
  success: boolean;
  clicked: boolean;
  selector: string;
  elementFound: boolean;
  elementVisible: boolean;
  timestamp: string;
  error?: string;
  screenshot?: string;
}
