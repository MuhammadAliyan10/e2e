"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { logError, logger } from "@/lib/logger";
import { getCurrentUser } from "./global.actions";
import { isTemporaryWorkflowId } from "@/lib/utils/workflow-id";
import type { WorkflowGraph } from "@/lib/types/workflow-editor.types";

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Save workflow graph (nodes + edges)
 * Handles both new (temporary ID) and existing workflows
 */
export async function saveWorkflowGraph(
  workflowId: string,
  graph: WorkflowGraph,
  metadata?: {
    name?: string;
    description?: string;
    category?: string;
  }
): Promise<ActionResult<{ id: string; isNew: boolean }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate graph (basic checks)
    if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
      return { success: false, error: "Invalid graph structure" };
    }

    // Check if this is a temporary ID (new workflow)
    if (isTemporaryWorkflowId(workflowId)) {
      // Create new workflow
      const workflow = await prisma.workflow.create({
        data: {
          userId: user.id,
          name: metadata?.name || "Untitled Workflow",
          description: metadata?.description || "",
          category: (metadata?.category as any) || "GENERAL",
          nodes: JSON.stringify(graph.nodes),
          edges: JSON.stringify(graph.edges),
          variables: graph.variables
            ? JSON.stringify(graph.variables)
            : JSON.stringify({}),
          version: 1,
          status: "DRAFT",
        },
      });

      logger.info({
        type: "workflow_created_from_editor",
        workflowId: workflow.id,
        userId: user.id,
        tempId: workflowId,
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
      });

      // Cache the new workflow
      if (redis.isAvailable()) {
        await redis.set(
          `workflow:${workflow.id}`,
          JSON.stringify({
            nodes: graph.nodes,
            edges: graph.edges,
            variables: graph.variables || {},
            version: 1,
          }),
          "EX",
          300
        );
        await redis.del(`dashboard:stats:${user.id}`);
      }

      revalidatePath("/workflows");
      revalidatePath("/dashboard");

      return {
        success: true,
        data: { id: workflow.id, isNew: true },
      };
    }

    // Verify ownership for existing workflow
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: user.id,
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    // Update existing workflow
    const updated = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        nodes: JSON.stringify(graph.nodes),
        edges: JSON.stringify(graph.edges),
        variables: graph.variables
          ? JSON.stringify(graph.variables)
          : undefined,
        version: { increment: 1 },
        updatedAt: new Date(),
        ...(metadata?.name && { name: metadata.name }),
        ...(metadata?.description && { description: metadata.description }),
        ...(metadata?.category && { category: metadata.category as any }),
      },
    });

    logger.info({
      type: "workflow_graph_saved",
      workflowId,
      userId: user.id,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      version: updated.version,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`workflow:${workflowId}`);
      await redis.set(
        `workflow:${workflowId}`,
        JSON.stringify({
          nodes: graph.nodes,
          edges: graph.edges,
          variables: graph.variables || {},
          version: updated.version,
        }),
        "EX",
        300
      );
    }

    revalidatePath(`/workflows/${workflowId}`);
    revalidatePath("/workflows");

    return {
      success: true,
      data: { id: workflowId, isNew: false },
    };
  } catch (error) {
    logError(error, { type: "save_workflow_graph_failed", workflowId });
    return { success: false, error: "Failed to save workflow" };
  }
}

/**
 * Load workflow graph
 */
export async function loadWorkflowGraph(
  workflowId: string
): Promise<ActionResult<WorkflowGraph>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Don't try to load temporary IDs from DB
    if (isTemporaryWorkflowId(workflowId)) {
      return {
        success: true,
        data: {
          nodes: [],
          edges: [],
          variables: {},
          version: 0,
        },
      };
    }

    // Try cache first
    if (redis.isAvailable()) {
      const cached = await redis.get(`workflow:${workflowId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
    }

    // Fetch from DB
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: user.id,
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    const graph: WorkflowGraph = {
      nodes: JSON.parse(workflow.nodes as string),
      edges: JSON.parse(workflow.edges as string),
      variables: workflow.variables
        ? JSON.parse(workflow.variables as string)
        : {},
      version: workflow.version,
    };

    // Cache for 5 minutes
    if (redis.isAvailable()) {
      await redis.set(
        `workflow:${workflowId}`,
        JSON.stringify(graph),
        "EX",
        300
      );
    }

    return { success: true, data: graph };
  } catch (error) {
    logError(error, { type: "load_workflow_graph_failed", workflowId });
    return { success: false, error: "Failed to load workflow" };
  }
}

/**
 * Update workflow status (DRAFT, PUBLISHED, PAUSED, ARCHIVED)
 */
export async function updateWorkflowStatus(
  workflowId: string,
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "ARCHIVED"
): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (isTemporaryWorkflowId(workflowId)) {
      return { success: false, error: "Save workflow before changing status" };
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: user.id,
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        status,
        ...(status === "PUBLISHED" && { publishedAt: new Date() }),
        ...(status === "ARCHIVED" && { archivedAt: new Date() }),
      },
    });

    logger.info({
      type: "workflow_status_updated",
      workflowId,
      userId: user.id,
      status,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`workflow:${workflowId}`);
      await redis.del(`dashboard:stats:${user.id}`);
    }

    revalidatePath(`/workflows/${workflowId}`);
    revalidatePath("/workflows");

    return { success: true };
  } catch (error) {
    logError(error, { type: "update_workflow_status_failed", workflowId });
    return { success: false, error: "Failed to update workflow status" };
  }
}

/**
 * Validate workflow graph before execution
 */
export async function validateWorkflowGraph(
  workflowId: string
): Promise<ActionResult<{ valid: boolean; errors: string[] }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await loadWorkflowGraph(workflowId);
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const { nodes, edges } = result.data;
    const errors: string[] = [];

    // Check for empty workflow
    if (nodes.length === 0) {
      errors.push("Workflow must have at least one node");
    }

    // Check for trigger node
    const hasTrigger = nodes.some((node) => node.type === "trigger");
    if (!hasTrigger) {
      errors.push("Workflow must have a trigger node");
    }

    // Check for disconnected nodes (except trigger)
    const connectedNodes = new Set<string>();
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    nodes.forEach((node) => {
      if (
        node.type !== "trigger" &&
        !connectedNodes.has(node.id) &&
        nodes.length > 1
      ) {
        errors.push(`Node "${node.data.label}" is not connected`);
      }
    });

    // Check for required fields in each node

    // Check for circular dependencies (basic DFS)
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(nodeId: string): boolean {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          if (hasCycle(edge.target)) return true;
        } else if (recursionStack.has(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          errors.push("Workflow contains circular dependencies");
          break;
        }
      }
    }

    return {
      success: true,
      data: {
        valid: errors.length === 0,
        errors,
      },
    };
  } catch (error) {
    logError(error, { type: "validate_workflow_graph_failed", workflowId });
    return { success: false, error: "Failed to validate workflow" };
  }
}
