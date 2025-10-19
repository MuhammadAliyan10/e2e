"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { logError, logger } from "@/lib/logger";
import { getCurrentUser } from "./global.actions";
import type { WorkflowGraph } from "@/lib/types/workflow-editor.types";

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Save workflow graph (nodes + edges)
 */
export async function saveWorkflowGraph(
  workflowId: string,
  graph: WorkflowGraph
): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: user.id,
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    // Validate graph (basic checks)
    if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
      return { success: false, error: "Invalid graph structure" };
    }

    // Update workflow
    await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        nodes: JSON.stringify(graph.nodes),
        edges: JSON.stringify(graph.edges),
        variables: graph.variables
          ? JSON.stringify(graph.variables)
          : undefined,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    logger.info({
      type: "workflow_graph_saved",
      workflowId,
      userId: user.id,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      version: graph.version + 1,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`workflow:${workflowId}`);
    }

    revalidatePath(`/dashboard/workflows/${workflowId}/edit`);

    return { success: true };
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

    // Check for disconnected nodes (except start node)
    const connectedNodes = new Set<string>();
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    nodes.forEach((node) => {
      if (!connectedNodes.has(node.id) && nodes.length > 1) {
        errors.push(`Node "${node.data.label}" is not connected`);
      }
    });

    // Check for required fields in each node
    nodes.forEach((node) => {
      switch (node.type) {
        case "navigate":
          if (!node.data.url) {
            errors.push(`Navigate node "${node.data.label}" missing URL`);
          }
          break;
        case "click":
          if (!node.data.selector) {
            errors.push(`Click node "${node.data.label}" missing selector`);
          }
          break;
        case "extract":
          if (node.data.extractions.length === 0) {
            errors.push(
              `Extract node "${node.data.label}" has no extractions configured`
            );
          }
          break;
        case "apiCall":
          if (node.type === "apiCall" && !node.data.url) {
            errors.push(`API node "${node.data.label}" missing URL`);
          }
          break;
      }
    });

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
