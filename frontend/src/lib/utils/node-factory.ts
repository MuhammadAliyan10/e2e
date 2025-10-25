// src/lib/utils/node-factory.ts
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type {
  NodeType,
  WorkflowNode,
  WorkflowNodeData,
  DataEdge,
  OnClickTriggerData,
  OpenURLNodeData,
  ClickElementNodeData,
  FillInputNodeData,
  SelectDropdownNodeData,
  UploadFileNodeData,
  DownloadFileNodeData,
  WaitForElementNodeData,
  ExtractTextNodeData,
  ExtractAttributeNodeData,
  TakeScreenshotNodeData,
  ScrollToElementNodeData,
  GoBackNodeData,
  GoForwardNodeData,
  HoverElementNodeData,
  DragAndDropNodeData,
  PressKeyNodeData,
  ExecuteJavaScriptNodeData,
  ReloadPageNodeData,
} from "@/lib/types/workflow-nodes.types";
import {
  getNodeDefinition,
  createDefaultNodeData,
  isValidNodeType,
} from "./node-registry";

// ============ VALIDATION SCHEMAS ============

const baseNodeSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .trim(),
  description: z.string().max(500, "Description too long").optional(),
  enabled: z.boolean().default(true),
  executionState: z
    .enum(["idle", "running", "success", "error", "warning"])
    .default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  retryCount: z.number().min(0).max(10).default(0),
});

const positionSchema = z.object({
  x: z.number().finite("X position must be finite"),
  y: z.number().finite("Y position must be finite"),
});

// ============ TYPES ============

export interface CreateNodeOptions {
  position?: { x: number; y: number };
  data?: Partial<WorkflowNodeData>;
  validate?: boolean;
  validateStrict?: boolean;
  style?: React.CSSProperties;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface BreadthFirstSearchQueueItem {
  id: string;
  depth: number;
}

export interface NodeSpec {
  type: NodeType;
  position: { x: number; y: number };
  data?: Partial<WorkflowNodeData>;
}

export interface BatchCreateResult {
  nodes: WorkflowNode[];
  errors: string[];
}

export interface CycleDetectionResult {
  hasCycles: boolean;
  nodesInCycle: string[];
}

// ============ TYPE GUARDS ============

function isTriggerNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<OnClickTriggerData> {
  return type === "trigger";
}

function isOpenURLNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<OpenURLNodeData> {
  return type === "openURL";
}

function isClickElementNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ClickElementNodeData> {
  return type === "clickElement";
}

function isFillInputNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<FillInputNodeData> {
  return type === "fillInput";
}

function isSelectDropdownNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<SelectDropdownNodeData> {
  return type === "selectDropdown";
}

function isUploadFileNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<UploadFileNodeData> {
  return type === "uploadFile";
}

function isDownloadFileNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<DownloadFileNodeData> {
  return type === "downloadFile";
}

function isWaitForElementNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<WaitForElementNodeData> {
  return type === "waitForElement";
}

function isExtractTextNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ExtractTextNodeData> {
  return type === "extractText";
}

function isExtractAttributeNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ExtractAttributeNodeData> {
  return type === "extractAttribute";
}

function isTakeScreenshotNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<TakeScreenshotNodeData> {
  return type === "takeScreenshot";
}

function isScrollToElementNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ScrollToElementNodeData> {
  return type === "scrollToElement";
}

function isGoBackNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<GoBackNodeData> {
  return type === "goBack";
}

function isGoForwardNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<GoForwardNodeData> {
  return type === "goForward";
}

function isHoverElementNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<HoverElementNodeData> {
  return type === "hoverElement";
}

function isDragAndDropNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<DragAndDropNodeData> {
  return type === "dragAndDrop";
}

function isPressKeyNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<PressKeyNodeData> {
  return type === "pressKey";
}

function isExecuteJavaScriptNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ExecuteJavaScriptNodeData> {
  return type === "executeJavaScript";
}

function isReloadPageNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): data is Partial<ReloadPageNodeData> {
  return type === "reloadPage";
}

// ============ FACTORY FUNCTIONS ============

/**
 * Safely create a workflow node with optional validation
 * @param type - Node type (must exist in NODE_REGISTRY)
 * @param options - Configuration options
 * @returns Fully initialized WorkflowNode
 * @throws Error if node type is invalid or strict validation fails
 */
export function createNodeSafe(
  type: NodeType,
  options: CreateNodeOptions = {}
): WorkflowNode {
  const {
    position = { x: 0, y: 0 },
    data = {},
    validate = false,
    validateStrict = false,
  } = options;

  try {
    // Validate node type exists
    if (!isValidNodeType(type)) {
      throw new Error(
        `Invalid node type: "${type}". Available types: trigger, clickElement, openURL, fillInput, etc.`
      );
    }

    // Get definition and defaults
    const defaultData = createDefaultNodeData(type);

    // Merge data (user overrides defaults)
    const nodeData: WorkflowNodeData = {
      ...defaultData,
      ...data,
      label: data.label?.trim() || defaultData.label,
      enabled: data.enabled ?? true,
      executionState: data.executionState || "idle",
      errors: data.errors || [],
      warnings: data.warnings || [],
      metadata: { ...defaultData.metadata, ...data.metadata },
    };

    // Validate node data if requested
    if (validate || validateStrict) {
      const validationResult = validateNodeData(type, nodeData, validateStrict);

      if (!validationResult.valid) {
        throw new Error(
          `Node validation failed for ${type}: ${validationResult.errors.join(
            ", "
          )}`
        );
      }

      // Log warnings (non-blocking)
      if (validationResult.warnings.length > 0) {
        console.warn(
          `[NodeFactory] Warnings for ${type} node:`,
          validationResult.warnings
        );
      }
    }

    // Validate position
    const positionResult = positionSchema.safeParse(position);
    if (!positionResult.success) {
      throw new Error(
        `Invalid position: ${positionResult.error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    // Create node with UUID
    const node: WorkflowNode = {
      id: `node_${uuidv4()}`,
      type,
      position: positionResult.data,
      data: nodeData,
    };

    console.log(
      `[NodeFactory] Created ${type} node: ${node.id} at (${position.x}, ${position.y})`,
      validateStrict
        ? "(strict validated)"
        : validate
        ? "(validated)"
        : "(unvalidated)"
    );

    return node;
  } catch (error) {
    console.error(`[NodeFactory] Failed to create ${type} node:`, error);
    throw error;
  }
}

/**
 * Validate node data with type-specific rules
 * @param type - Node type
 * @param data - Node data to validate
 * @param strict - If true, enforce required fields for execution
 * @returns Validation result with errors and warnings
 */
export function validateNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>,
  strict = false
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Base validation (always run)
    const baseResult = baseNodeSchema.safeParse(data);
    if (!baseResult.success) {
      errors.push(
        ...baseResult.error.errors.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        )
      );
    }

    // Type-specific validation using type guards
    if (isTriggerNodeData(type, data)) {
      validateTriggerNode(data, strict, errors, warnings);
    } else if (isOpenURLNodeData(type, data)) {
      validateOpenURLNode(data, strict, errors, warnings);
    } else if (isClickElementNodeData(type, data)) {
      validateClickElementNode(data, strict, errors, warnings);
    } else if (isFillInputNodeData(type, data)) {
      validateFillInputNode(data, strict, errors, warnings);
    } else if (isSelectDropdownNodeData(type, data)) {
      validateSelectDropdownNode(data, strict, errors, warnings);
    } else if (isUploadFileNodeData(type, data)) {
      validateUploadFileNode(data, strict, errors, warnings);
    } else if (isDownloadFileNodeData(type, data)) {
      validateDownloadFileNode(data, strict, errors, warnings);
    } else if (isWaitForElementNodeData(type, data)) {
      validateWaitForElementNode(data, strict, errors, warnings);
    } else if (isExtractTextNodeData(type, data)) {
      validateExtractTextNode(data, strict, errors, warnings);
    } else if (isExtractAttributeNodeData(type, data)) {
      validateExtractAttributeNode(data, strict, errors, warnings);
    } else if (isTakeScreenshotNodeData(type, data)) {
      validateTakeScreenshotNode(data, strict, errors, warnings);
    } else if (isScrollToElementNodeData(type, data)) {
      validateScrollToElementNode(data, strict, errors, warnings);
    } else if (isGoBackNodeData(type, data)) {
      validateGoBackNode(data, strict, errors, warnings);
    } else if (isGoForwardNodeData(type, data)) {
      validateGoForwardNode(data, strict, errors, warnings);
    } else if (isHoverElementNodeData(type, data)) {
      validateHoverElementNode(data, strict, errors, warnings);
    } else if (isDragAndDropNodeData(type, data)) {
      validateDragAndDropNode(data, strict, errors, warnings);
    } else if (isPressKeyNodeData(type, data)) {
      validatePressKeyNode(data, strict, errors, warnings);
    } else if (isExecuteJavaScriptNodeData(type, data)) {
      validateExecuteJavaScriptNode(data, strict, errors, warnings);
    } else if (isReloadPageNodeData(type, data)) {
      validateReloadPageNode(data, strict, errors, warnings);
    } else {
      console.debug(
        `[NodeFactory] No specific validation for node type: ${type}`
      );
    }

    // Cross-field validation
    if (data.enabled === false && strict) {
      warnings.push("Node is disabled and will be skipped during execution");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    console.error("[NodeFactory] Validation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      valid: false,
      errors: [`Internal validation error: ${errorMessage}`],
      warnings,
    };
  }
}

// ============ TYPE-SPECIFIC VALIDATORS ============

function validateTriggerNode(
  data: Partial<OnClickTriggerData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict) {
    if (data.debounceMs !== undefined && data.debounceMs > 10000) {
      warnings.push("Debounce >10s may delay workflow execution");
    }
    if (data.maxExecutions !== undefined && data.maxExecutions < 1) {
      errors.push("Max executions must be at least 1");
    }
  }
}

function validateOpenURLNode(
  data: Partial<OpenURLNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.url?.trim()) {
    errors.push("URL is required");
  } else if (data.url) {
    try {
      new URL(data.url);
    } catch {
      errors.push("Invalid URL format");
    }
  }
  if (
    data.timeout !== undefined &&
    (data.timeout < 1000 || data.timeout > 120000)
  ) {
    warnings.push("Timeout should be between 1-120 seconds");
  }
}

function validateClickElementNode(
  data: Partial<ClickElementNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  } else if (!strict && !data.selector) {
    warnings.push("Selector should be configured before execution");
  }

  // Validate selector syntax for CSS
  if (data.selector && data.selectorType === "css") {
    try {
      document.createElement("div").querySelector(data.selector);
    } catch {
      warnings.push("Invalid CSS selector syntax");
    }
  }
}

function validateFillInputNode(
  data: Partial<FillInputNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  } else if (!strict && !data.selector) {
    warnings.push("Selector should be configured before execution");
  }

  if (data.selector && data.selectorType === "css") {
    try {
      document.createElement("div").querySelector(data.selector);
    } catch {
      warnings.push("Invalid CSS selector syntax");
    }
  }
}

function validateSelectDropdownNode(
  data: Partial<SelectDropdownNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  } else if (!strict && !data.selector) {
    warnings.push("Selector should be configured before execution");
  }
}

function validateUploadFileNode(
  data: Partial<UploadFileNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.filePath?.trim()) {
    errors.push("File path is required");
  }
  if (data.fileSource === "url" && data.filePath) {
    try {
      new URL(data.filePath);
    } catch {
      errors.push("Invalid file URL");
    }
  }
}

function validateDownloadFileNode(
  data: Partial<DownloadFileNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.savePath?.trim()) {
    errors.push("Save path is required");
  }
  if (data.url) {
    try {
      new URL(data.url);
    } catch {
      errors.push("Invalid download URL");
    }
  }
}

function validateWaitForElementNode(
  data: Partial<WaitForElementNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  }
}

function validateExtractTextNode(
  data: Partial<ExtractTextNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  }
}

function validateExtractAttributeNode(
  data: Partial<ExtractAttributeNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  }
  if (strict && !data.attribute?.trim()) {
    errors.push("Attribute name is required");
  }
}

function validateTakeScreenshotNode(
  data: Partial<TakeScreenshotNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (data.quality !== undefined && (data.quality < 0 || data.quality > 100)) {
    errors.push("Screenshot quality must be between 0-100");
  }
}

function validateScrollToElementNode(
  data: Partial<ScrollToElementNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  // Optional validation - can scroll to element or by distance/direction
  if (strict && !data.selector && !data.distance) {
    warnings.push("Either selector or distance should be specified");
  }
}

function validateGoBackNode(
  data: Partial<GoBackNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (data.timeout !== undefined && data.timeout > 120000) {
    warnings.push("Navigation timeout >120s may cause issues");
  }
}

function validateGoForwardNode(
  data: Partial<GoForwardNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (data.timeout !== undefined && data.timeout > 120000) {
    warnings.push("Navigation timeout >120s may cause issues");
  }
}

function validateHoverElementNode(
  data: Partial<HoverElementNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.selector?.trim()) {
    errors.push("Selector is required");
  }
}

function validateDragAndDropNode(
  data: Partial<DragAndDropNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict) {
    if (!data.sourceSelector?.trim()) {
      errors.push("Source selector is required");
    }
    if (!data.targetSelector?.trim()) {
      errors.push("Target selector is required");
    }
  }
}

function validatePressKeyNode(
  data: Partial<PressKeyNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.key?.trim()) {
    errors.push("Key is required");
  }
  const validKeys = [
    "Enter",
    "Escape",
    "Tab",
    "Space",
    "ArrowUp",
    "ArrowDown",
    "Delete",
    "Backspace",
  ];
  if (data.key && !validKeys.includes(data.key) && data.key.length > 1) {
    warnings.push("Special key may not be supported in all browsers");
  }
}

function validateExecuteJavaScriptNode(
  data: Partial<ExecuteJavaScriptNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  if (strict && !data.script?.trim()) {
    errors.push("JavaScript code is required");
  }
  if (data.script && data.script.includes("eval(")) {
    warnings.push("Using eval() is dangerous and should be avoided");
  }
}

function validateReloadPageNode(
  data: Partial<ReloadPageNodeData>,
  strict: boolean,
  errors: string[],
  warnings: string[]
): void {
  // No specific validation needed for reload page
}

/**
 * Validate node before workflow execution (strict mode)
 */
export function validateNodeForExecution(node: WorkflowNode): ValidationResult {
  return validateNodeData(node.type, node.data, true);
}

/**
 * Validate entire workflow before execution
 */
export function validateWorkflowForExecution(
  nodes: WorkflowNode[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (nodes.length === 0) {
    errors.push("Workflow has no nodes");
    return { valid: false, errors, warnings };
  }

  nodes.forEach((node, index) => {
    if (node.data.enabled === false) {
      warnings.push(`Node #${index + 1} "${node.data.label}" is disabled`);
      return;
    }

    const result = validateNodeForExecution(node);
    if (!result.valid) {
      errors.push(
        ...result.errors.map((err) => `Node "${node.data.label}": ${err}`)
      );
    }
    warnings.push(
      ...result.warnings.map((warn) => `Node "${node.data.label}": ${warn}`)
    );
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate node connection
 */
export function validateNodeConnection(
  source: WorkflowNode,
  target: WorkflowNode
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Self-connection check
  if (source.id === target.id) {
    errors.push("Cannot connect node to itself");
  }

  // Trigger nodes cannot receive connections
  if (target.type === "trigger") {
    errors.push("Trigger nodes cannot have incoming connections");
  }

  // Check output compatibility
  const sourceDefinition = getNodeDefinition(source.type);

  if (!sourceDefinition.outputSchema) {
    warnings.push(
      `${sourceDefinition.label} has no output schema - data may not flow correctly`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate workflow graph structure
 */
export function validateWorkflowGraph(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for trigger
  const triggers = nodes.filter((n) => n.type === "trigger");
  if (triggers.length === 0) {
    errors.push("Workflow must have at least one trigger node");
  }

  // Check for orphaned nodes
  const connectedNodeIds = new Set<string>();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  nodes.forEach((node) => {
    if (node.type !== "trigger" && !connectedNodeIds.has(node.id)) {
      warnings.push(`Node "${node.data.label}" is not connected`);
    }
  });

  // Detect cycles
  const cycleCheck = detectSimpleCycles(nodes, edges);
  if (cycleCheck.hasCycles) {
    warnings.push(
      `Potential cycle detected: ${cycleCheck.nodesInCycle.join(" → ")}`
    );
  }

  // Check depth
  const maxDepth = calculateMaxDepth(nodes, edges);
  if (maxDepth > 50) {
    warnings.push(
      `Workflow depth is ${maxDepth} nodes - consider breaking into sub-workflows`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detect cycles using DFS
 * @param nodes - All workflow nodes
 * @param edges - All edges in the workflow graph
 * @returns Object with cycle detection result and node labels involved
 */
export function detectSimpleCycles(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): CycleDetectionResult {
  const adjacency = new Map<string, string[]>();
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycleNodes = new Set<string>();

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          cycleNodes.add(nodeId);
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        cycleNodes.add(nodeId);
        cycleNodes.add(neighbor);
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) break;
    }
  }

  return {
    hasCycles: cycleNodes.size > 0,
    nodesInCycle: Array.from(cycleNodes).map(
      (id) => nodes.find((n) => n.id === id)?.data.label || id
    ),
  };
}

/**
 * Calculate max depth from trigger nodes using BFS
 * @param nodes - All workflow nodes
 * @param edges - All edges in the workflow graph
 * @returns Maximum depth from any trigger node
 */
export function calculateMaxDepth(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): number {
  const adjacency = new Map<string, string[]>();
  const depths = new Map<string, number>();

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  const triggers = nodes.filter((n) => n.type === "trigger");

  function bfs(startId: string): void {
    const queue: BreadthFirstSearchQueueItem[] = [{ id: startId, depth: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const { id, depth } = current;
      if (visited.has(id)) continue;
      visited.add(id);

      const currentDepth = depths.get(id) || 0;
      depths.set(id, Math.max(currentDepth, depth));

      const neighbors = adjacency.get(id) || [];
      neighbors.forEach((neighbor) => {
        queue.push({ id: neighbor, depth: depth + 1 });
      });
    }
  }

  triggers.forEach((trigger) => bfs(trigger.id));

  return Math.max(...Array.from(depths.values()), 0);
}

/**
 * Clone node with new ID and position
 * @param node - Node to clone
 * @param position - New position for cloned node
 * @returns New node with fresh ID and reset execution state
 */
export function cloneNode(
  node: WorkflowNode,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    ...node,
    id: `node_${uuidv4()}`,
    position,
    data: {
      ...node.data,
      label: `${node.data.label} (Copy)`,
      executionState: "idle",
      errors: [],
      warnings: [],
      lastExecutedAt: null,
      executionCount: 0,
    },
  };
}

/**
 * Batch create nodes (for templates/AI generation)
 * @param nodeSpecs - Array of node specifications to create
 * @returns Created nodes and any errors encountered
 */
export function createNodesBatch(nodeSpecs: NodeSpec[]): BatchCreateResult {
  const nodes: WorkflowNode[] = [];
  const errors: string[] = [];

  nodeSpecs.forEach((spec, index) => {
    try {
      const node = createNodeSafe(spec.type, {
        position: spec.position,
        data: spec.data,
        validate: false,
      });
      nodes.push(node);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorMsg = `Node ${index} (${spec.type}): ${errorMessage}`;
      errors.push(errorMsg);
      console.error(`[NodeFactory] Batch creation error:`, errorMsg);
    }
  });

  if (errors.length > 0) {
    console.warn(
      `[NodeFactory] Batch creation completed with ${errors.length}/${nodeSpecs.length} failures`
    );
  }

  return { nodes, errors };
}
