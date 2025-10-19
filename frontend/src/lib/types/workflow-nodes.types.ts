import type { Node, Edge } from "reactflow";

// ============ BASE TYPES ============
export interface NodeOutput {
  data: any;
  metadata?: {
    timestamp: string;
    duration?: number;
    success: boolean;
  };
}

export interface BaseNodeData {
  label: string;
  description?: string;
  outputSchema?: Record<string, any>;
  errors?: string[];
  outputs?: NodeOutput;
}

// ============ TRIGGER NODE ============
export interface TriggerNodeData extends BaseNodeData {
  type: "manual" | "schedule" | "webhook";
  schedule?: string; // Cron expression (5 fields)
  webhookUrl?: string; // Generated webhook endpoint
  enabled?: boolean; // Trigger active state
  lastTriggered?: string; // ISO timestamp
}

// ============ AI AGENT NODE ============
export interface AIAgentNodeData extends BaseNodeData {
  url: string;
  prompt: string;
  context?: string;
  model?: "gpt-4" | "gpt-3.5-turbo" | "claude-3";
  maxSteps?: number;
  outputFormat?: "text" | "json" | "structured";
}

// ============ BROWSER NODES ============
export interface NavigateNodeData extends BaseNodeData {
  url: string;
  waitForSelector?: string;
  timeout?: number;
}

export interface ClickNodeData extends BaseNodeData {
  selector: string;
  clickType: "single" | "double" | "right";
}

export interface TypeNodeData extends BaseNodeData {
  selector: string;
  text: string;
  pressEnter?: boolean;
}

export interface ExtractNodeData extends BaseNodeData {
  extractions: Array<{
    key: string;
    selector: string;
    attribute?: string;
    multiple?: boolean;
  }>;
}

export interface ScreenshotNodeData extends BaseNodeData {
  fullPage?: boolean;
  selector?: string;
  format?: "png" | "jpeg";
}

export interface ScrollNodeData extends BaseNodeData {
  direction: "up" | "down" | "toElement";
  selector?: string;
  distance?: number;
}

export interface HoverNodeData extends BaseNodeData {
  selector: string;
  duration?: number;
}

export interface SelectNodeData extends BaseNodeData {
  selector: string;
  value: string;
}

export interface UploadFileNodeData extends BaseNodeData {
  selector: string;
  filePath: string;
}

// ============ LOGIC NODES ============
export interface ConditionNodeData extends BaseNodeData {
  conditions: Array<{
    field: string;
    operator: "equals" | "contains" | "gt" | "lt" | "exists";
    value: any;
  }>;
  logic: "AND" | "OR";
}

export interface LoopNodeData extends BaseNodeData {
  items: string;
  maxIterations: number;
}

export interface SwitchNodeData extends BaseNodeData {
  inputField: string;
  cases: Array<{
    value: any;
    outputIndex: number;
  }>;
  defaultOutput?: number;
}

export interface MergeNodeData extends BaseNodeData {
  mode: "append" | "merge" | "first" | "last";
}

// ============ DATA NODES ============
export interface TransformNodeData extends BaseNodeData {
  transformations: Array<{
    input: string;
    output: string;
    function: string;
  }>;
}

export interface FilterNodeData extends BaseNodeData {
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface SetVariableNodeData extends BaseNodeData {
  variables: Array<{
    key: string;
    value: string;
  }>;
}

// ============ INTEGRATION NODES ============
export interface HttpRequestNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: {
    type: "none" | "basic" | "bearer" | "oauth2";
    credentials?: Record<string, string>;
  };
}

export interface WebhookNodeData extends BaseNodeData {
  method: "GET" | "POST";
  path: string;
  responseMode: "lastNode" | "onReceived";
}

// ============ UNION TYPES ============
export type NodeType =
  | "trigger"
  | "aiAgent"
  | "navigate"
  | "click"
  | "type"
  | "extract"
  | "screenshot"
  | "scroll"
  | "hover"
  | "select"
  | "uploadFile"
  | "condition"
  | "loop"
  | "switch"
  | "merge"
  | "transform"
  | "filter"
  | "setVariable"
  | "httpRequest"
  | "webhook";

export type WorkflowNodeData =
  | TriggerNodeData
  | AIAgentNodeData
  | NavigateNodeData
  | ClickNodeData
  | TypeNodeData
  | ExtractNodeData
  | ScreenshotNodeData
  | ScrollNodeData
  | HoverNodeData
  | SelectNodeData
  | UploadFileNodeData
  | ConditionNodeData
  | LoopNodeData
  | SwitchNodeData
  | MergeNodeData
  | TransformNodeData
  | FilterNodeData
  | SetVariableNodeData
  | HttpRequestNodeData
  | WebhookNodeData;

export interface WorkflowNode extends Node {
  type: NodeType;
  data: WorkflowNodeData;
}

export type DataEdge = Edge & {
  animated?: boolean;
  data?: {
    payload?: any;
    schema?: Record<string, any>;
  };
};

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: DataEdge[];
  variables?: Record<string, any>;
  version: number;
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: "error" | "warning";
  message: string;
}
