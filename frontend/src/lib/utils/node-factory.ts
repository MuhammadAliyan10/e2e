import { nanoid } from "nanoid";
import type {
  NodeType,
  WorkflowNode,
  WorkflowNodeData,
} from "@/lib/types/workflow-nodes.types";
import {
  NODE_REGISTRY,
  isValidNodeType,
  getFallbackNode,
} from "./node-registry";

/**
 * Create a new workflow node with default data
 * @throws Error if node type not found in registry
 */
export function createNode(
  type: NodeType,
  position: { x: number; y: number },
  overrides?: Partial<WorkflowNodeData>
): WorkflowNode {
  // Validate node type exists
  if (!isValidNodeType(type)) {
    const availableTypes = Object.keys(NODE_REGISTRY).join(", ");
    const errorMsg = `Unknown node type: "${type}". Available types: ${availableTypes}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const definition = NODE_REGISTRY[type];

  // Double-check definition exists (defensive programming)
  if (!definition || !definition.defaultData) {
    console.error(`Node definition or defaultData missing for type: "${type}"`);
    console.error("Definition:", definition);
    throw new Error(
      `Critical error: Node definition incomplete for type "${type}". Please check NODE_REGISTRY.`
    );
  }

  return {
    id: nanoid(),
    type,
    position,
    data: {
      ...definition.defaultData,
      ...overrides,
    },
  } as WorkflowNode;
}

/**
 * Safely create node with fallback to trigger on error
 */
export function createNodeSafe(
  type: NodeType,
  position: { x: number; y: number },
  overrides?: Partial<WorkflowNodeData>
): WorkflowNode {
  try {
    return createNode(type, position, overrides);
  } catch (error) {
    console.error(
      `Failed to create node type "${type}", falling back to trigger:`,
      error
    );
    const fallback = getFallbackNode();
    return {
      id: nanoid(),
      type: "trigger",
      position,
      data: {
        ...fallback.defaultData,
        label: `${fallback.defaultData.label} (Recovered)`,
      },
    } as WorkflowNode;
  }
}

/**
 * Validate node connection between source and target
 */
export function validateNodeConnection(
  source: WorkflowNode,
  target: WorkflowNode
): { valid: boolean; error?: string } {
  // Prevent self-connections
  if (source.id === target.id) {
    return { valid: false, error: "Cannot connect node to itself" };
  }

  // Validate both nodes are registered types
  if (!isValidNodeType(source.type)) {
    return { valid: false, error: `Invalid source node type: ${source.type}` };
  }

  if (!isValidNodeType(target.type)) {
    return { valid: false, error: `Invalid target node type: ${target.type}` };
  }

  // Trigger nodes cannot have inputs
  if (target.type === "trigger") {
    return { valid: false, error: "Trigger nodes cannot receive connections" };
  }

  return { valid: true };
}

/**
 * Validate workflow graph structure
 */
export function validateWorkflowGraph(
  nodes: WorkflowNode[],
  edges: any[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for trigger node
  const hasTrigger = nodes.some((node) => node.type === "trigger");
  if (!hasTrigger && nodes.length > 0) {
    errors.push("Workflow must have at least one trigger node");
  }

  // Validate all node types
  nodes.forEach((node, index) => {
    if (!isValidNodeType(node.type)) {
      errors.push(`Node at index ${index} has invalid type: ${node.type}`);
    }

    if (!node.data || !node.data.label) {
      errors.push(`Node ${node.id} missing required data.label field`);
    }
  });

  // Check for disconnected nodes (except trigger)
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  nodes.forEach((node) => {
    if (
      node.type !== "trigger" &&
      !connectedNodeIds.has(node.id) &&
      nodes.length > 1
    ) {
      errors.push(
        `Node "${node.data.label}" (${node.id}) is not connected to the workflow`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
