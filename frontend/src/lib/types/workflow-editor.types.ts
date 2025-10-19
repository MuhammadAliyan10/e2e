import type { Node, Edge } from "reactflow";

export type NodeType =
  | "navigate"
  | "click"
  | "fillForm"
  | "extract"
  | "condition"
  | "loop"
  | "apiCall"
  | "script"
  | "wait"
  | "notification";

export interface BaseNodeData {
  label: string;
  description?: string;
  variables?: Record<string, any>;
  errors?: string[];
}

export interface NavigateNodeData extends BaseNodeData {
  url: string;
  waitForSelector?: string;
  waitForNavigation?: boolean;
  timeout?: number;
}

export interface ClickNodeData extends BaseNodeData {
  selector: string;
  clickType: "single" | "double" | "right";
  waitAfterClick?: number;
}

export interface FillFormNodeData extends BaseNodeData {
  fields: Array<{
    selector: string;
    value: string;
    type: "text" | "select" | "checkbox" | "radio";
  }>;
  submitAfter?: boolean;
}

export interface ExtractNodeData extends BaseNodeData {
  extractions: Array<{
    name: string;
    selector: string;
    attribute?: string;
    multiple?: boolean;
  }>;
}

export interface ConditionNodeData extends BaseNodeData {
  conditions: Array<{
    variable: string;
    operator: "equals" | "contains" | "greaterThan" | "lessThan" | "exists";
    value: string;
  }>;
  logic: "AND" | "OR";
}

export interface LoopNodeData extends BaseNodeData {
  items: string;
  maxIterations?: number;
}

export interface ApiCallNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  auth?: {
    type: "none" | "basic" | "bearer" | "apiKey";
    credentials?: Record<string, string>;
  };
}

export interface ScriptNodeData extends BaseNodeData {
  code: string;
  language: "javascript" | "python";
  timeout?: number;
}

export interface WaitNodeData extends BaseNodeData {
  duration: number;
  unit: "ms" | "s" | "m";
}

export interface NotificationNodeData extends BaseNodeData {
  type: "email" | "slack" | "webhook";
  recipient: string;
  message: string;
  template?: string;
}

export type WorkflowNodeData =
  | NavigateNodeData
  | ClickNodeData
  | FillFormNodeData
  | ExtractNodeData
  | ConditionNodeData
  | LoopNodeData
  | ApiCallNodeData
  | ScriptNodeData
  | WaitNodeData
  | NotificationNodeData;

export interface WorkflowNode extends Node {
  type: NodeType;
  data: WorkflowNodeData;
}

export type WorkflowEdge = Edge & {
  animated?: boolean;
  label?: string;
};

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: Record<string, any>;
  version: number;
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: "error" | "warning";
  message: string;
}
