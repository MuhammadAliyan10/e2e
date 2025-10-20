import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type {
  NodeType,
  WorkflowNode,
  WorkflowNodeData,
} from "@/lib/types/workflow-nodes.types";
import {
  getNodeDefinition,
  createDefaultNodeData,
  NODE_BG_COLOR,
  EDGE_COLOR,
} from "./node-registry";

// ===== VALIDATION SCHEMAS =====

const baseNodeSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .trim(),
  description: z.string().max(500, "Description too long").optional(),
  enabled: z.boolean().default(true),
  executionState: z
    .enum(["idle", "running", "success", "error", "warning", "skipped"])
    .default("idle"),
});

const positionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

// ===== TYPES =====

export interface CreateNodeOptions {
  position?: { x: number; y: number };
  data?: Partial<WorkflowNodeData>;
  validate?: boolean; // ⚠️ CHANGED: default false for creation
  validateStrict?: boolean; // ✅ NEW: strict mode for execution
  style?: React.CSSProperties;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// ===== FACTORY FUNCTIONS =====

/**
 * Create a workflow node with optional validation
 * @param validate - Basic validation (label, structure) - default: false for creation
 * @param validateStrict - Strict validation (required fields) - default: false, use for execution
 */
export function createNodeSafe(
  type: NodeType,
  options: CreateNodeOptions = {}
): WorkflowNode {
  const {
    position = { x: 0, y: 0 },
    data = {},
    validate = false, // ✅ CHANGED: no validation on creation by default
    validateStrict = false,
    style = {},
  } = options;

  try {
    // Get definition and defaults
    const definition = getNodeDefinition(type);
    const defaultData = createDefaultNodeData(type);

    // Merge data (user data overrides defaults)
    const nodeData: WorkflowNodeData = {
      ...defaultData,
      ...data,
      label: data.label || defaultData.label,
      enabled: data.enabled !== undefined ? data.enabled : true,
      executionState: data.executionState || "idle",
    };

    // Validate node data (only if requested)
    if (validate || validateStrict) {
      const validationResult = validateNodeData(type, nodeData, validateStrict);
      if (!validationResult.valid) {
        throw new Error(
          `Node validation failed: ${validationResult.errors.join(", ")}`
        );
      }

      // Log warnings (non-blocking)
      if (validationResult.warnings && validationResult.warnings.length > 0) {
        console.warn(
          `[NodeFactory] Warnings for ${type}:`,
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

    // Create node
    const node: WorkflowNode = {
      id: uuidv4(),
      type,
      position,
      data: nodeData,
      style: {
        backgroundColor: NODE_BG_COLOR,
        borderColor: EDGE_COLOR,
        borderWidth: 2,
        borderRadius: 12,
        ...style,
      },
    };

    console.log(
      `[NodeFactory] Created ${type} node:`,
      node.id,
      `at (${position.x}, ${position.y})`,
      validateStrict ? "(strict validated)" : "(unvalidated)"
    );

    return node;
  } catch (error) {
    console.error(`[NodeFactory] Failed to create ${type} node:`, error);
    throw error;
  }
}

/**
 * Validate node data against base schema + type-specific rules
 * @param strict - If true, enforce all required fields (for execution)
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

    // Type-specific validation (only in strict mode for required fields)
    if (strict) {
      switch (type) {
        case "openURL":
          if (!(data as any).url || (data as any).url.trim().length === 0) {
            errors.push("URL is required for OpenURL node");
          } else {
            try {
              new URL((data as any).url);
            } catch {
              errors.push("Invalid URL format");
            }
          }
          break;

        case "httpRequest":
          if (!(data as any).url) {
            errors.push("URL is required for HTTP Request node");
          }
          if (!(data as any).method) {
            errors.push("HTTP method is required");
          }
          break;

        case "setVariable":
          if (!(data as any).variableName) {
            errors.push("Variable name is required");
          } else if (
            !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test((data as any).variableName)
          ) {
            errors.push(
              "Variable name must start with letter/underscore and contain only alphanumeric/underscore"
            );
          }
          break;

        case "clickElement":
        case "fillInput":
        case "extractText":
          if (!(data as any).selector) {
            errors.push("Selector is required");
          }
          break;

        case "loop":
          if (
            (data as any).maxIterations &&
            (data as any).maxIterations > 10000
          ) {
            warnings.push("Max iterations >10000 may cause performance issues");
          }
          break;

        case "delay":
          if ((data as any).delayMs && (data as any).delayMs > 300000) {
            warnings.push("Delay >5 minutes may cause timeout issues");
          }
          break;
      }
    } else {
      // Non-strict mode: only warn about missing required fields
      switch (type) {
        case "openURL":
          if (!(data as any).url || (data as any).url.trim().length === 0) {
            warnings.push("URL should be configured before execution");
          }
          break;

        case "clickElement":
        case "fillInput":
        case "extractText":
          if (!(data as any).selector) {
            warnings.push("Selector should be configured before execution");
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    console.error("[NodeFactory] Validation error:", error);
    return {
      valid: false,
      errors: ["Validation failed due to internal error"],
      warnings,
    };
  }
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

  nodes.forEach((node) => {
    if (node.data.enabled === false) {
      warnings.push(
        `Node "${node.data.label}" is disabled and will be skipped`
      );
      return; // Skip validation for disabled nodes
    }

    const result = validateNodeForExecution(node);
    if (!result.valid) {
      errors.push(...result.errors.map((err) => `${node.data.label}: ${err}`));
    }
    if (result.warnings) {
      warnings.push(
        ...result.warnings.map((warn) => `${node.data.label}: ${warn}`)
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateNodeConnection(
  source: WorkflowNode,
  target: WorkflowNode
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Prevent self-connection
  if (source.id === target.id) {
    errors.push("Cannot connect node to itself");
  }

  // Trigger nodes can only be sources
  if (target.type === "trigger") {
    errors.push("Trigger nodes cannot receive incoming connections");
  }

  // Note nodes cannot have connections
  if (source.type === "note" || target.type === "note") {
    errors.push(
      "Note nodes are for documentation only and cannot be connected"
    );
  }

  // Check for circular dependencies (basic check)
  if (source.type === target.type && source.type === "loop") {
    warnings.push("Connecting loops may create infinite recursion");
  }

  // Validate data flow compatibility
  const sourceDefinition = getNodeDefinition(source.type);
  const targetDefinition = getNodeDefinition(target.type);

  // Check if source has output schema
  if (!sourceDefinition.outputSchema) {
    warnings.push(
      `${sourceDefinition.label} has no defined output schema - connection may fail at runtime`
    );
  }

  // Check if target expects input schema
  if (!targetDefinition.inputSchema) {
    warnings.push(
      `${targetDefinition.label} has no defined input schema - may not process data correctly`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate entire workflow graph
 */
export function validateWorkflowGraph(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for at least one trigger
  const triggers = nodes.filter((n) => n.type === "trigger");
  if (triggers.length === 0) {
    errors.push("Workflow must have at least one trigger node");
  }

  // Check for multiple triggers (valid but worth warning)
  if (triggers.length > 3) {
    warnings.push(
      `Workflow has ${triggers.length} triggers - consider consolidating`
    );
  }

  // Check for orphaned nodes (except triggers and notes)
  const connectedNodeIds = new Set<string>();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  nodes.forEach((node) => {
    if (
      node.type !== "trigger" &&
      node.type !== "note" &&
      !connectedNodeIds.has(node.id)
    ) {
      warnings.push(
        `Node "${node.data.label}" (${node.type}) is not connected`
      );
    }
  });

  // Check for disabled nodes in critical paths
  const disabledNodes = nodes.filter((n) => n.data.enabled === false);
  if (disabledNodes.length > 0) {
    warnings.push(
      `${disabledNodes.length} node(s) are disabled and will be skipped during execution`
    );
  }

  // Detect simple cycles (full topological sort is expensive, do basic check)
  const cycleCheck = detectSimpleCycles(nodes, edges);
  if (cycleCheck.hasCycles) {
    warnings.push(
      `Potential cycle detected involving nodes: ${cycleCheck.nodesInCycle.join(
        ", "
      )}`
    );
  }

  // Check graph depth (warn if too deep)
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
 * Detect simple cycles using DFS (basic implementation)
 */
export function detectSimpleCycles(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): { hasCycles: boolean; nodesInCycle: string[] } {
  const adjacency = new Map<string, string[]>();
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycleNodes = new Set<string>();

  // Build adjacency list
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  // DFS to detect cycles
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

  // Check all nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        break;
      }
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
 * Calculate maximum depth of workflow graph
 */
export function calculateMaxDepth(
  nodes: WorkflowNode[],
  edges: DataEdge[]
): number {
  const adjacency = new Map<string, string[]>();
  const depths = new Map<string, number>();

  // Build adjacency list
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  // Find trigger nodes (starting points)
  const triggers = nodes.filter((n) => n.type === "trigger");

  // BFS to calculate depths
  function bfs(startId: string) {
    const queue: Array<{ id: string; depth: number }> = [
      { id: startId, depth: 0 },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
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

  // Run BFS from each trigger
  triggers.forEach((trigger) => bfs(trigger.id));

  // Return max depth
  return Math.max(...Array.from(depths.values()), 0);
}

/**
 * Clone a node with new ID and position
 */
export function cloneNode(
  node: WorkflowNode,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    ...node,
    id: uuidv4(),
    position,
    data: {
      ...node.data,
      label: `${node.data.label} (copy)`,
    },
  };
}

/**
 * Batch create nodes (for AI generation or templates)
 */
export function createNodesBatch(
  nodeSpecs: Array<{
    type: NodeType;
    position: { x: number; y: number };
    data?: Partial<WorkflowNodeData>;
  }>
): WorkflowNode[] {
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
      console.error(
        `[NodeFactory] Failed to create node at index ${index}:`,
        error
      );
      errors.push(`Node ${index} (${spec.type}): ${(error as Error).message}`);
    }
  });

  if (errors.length > 0) {
    console.warn(
      `[NodeFactory] Batch creation completed with ${errors.length} errors:`,
      errors
    );
  }

  return nodes;
}
