"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { logError, logger } from "@/lib/logger";
import { getCurrentUser } from "./global.actions";
import type {
  WorkflowFilters,
  WorkflowSort,
  WorkflowTableData,
  CreateWorkflowInput,
  UpdateWorkflowInput,
  BulkWorkflowAction,
} from "@/lib/types/workflow.types";

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Get workflows with pagination, filtering, and sorting
 */
export async function getWorkflows(
  page: number = 1,
  pageSize: number = 10,
  filters?: WorkflowFilters,
  sort?: WorkflowSort
): Promise<ActionResult<WorkflowTableData>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters?.category && filters.category.length > 0) {
      where.category = { in: filters.category };
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters?.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to,
      };
    }

    // Build order by
    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.direction;
    } else {
      orderBy.updatedAt = "desc";
    }

    // Fetch data
    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        include: {
          _count: {
            select: { executions: true },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.workflow.count({ where }),
    ]);

    return {
      success: true,
      data: {
        workflows,
        total,
        page,
        pageSize,
      },
    };
  } catch (error) {
    logError(error, { type: "get_workflows_failed" });
    return {
      success: false,
      error: "Failed to fetch workflows",
    };
  }
}

/**
 * Get workflow by ID
 */
export async function getWorkflow(id: string): Promise<ActionResult<any>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    return { success: true, data: workflow };
  } catch (error) {
    logError(error, { type: "get_workflow_failed", workflowId: id });
    return { success: false, error: "Failed to fetch workflow" };
  }
}

/**
 * Create workflow
 */
export async function createWorkflow(
  input: CreateWorkflowInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId: user.id,
        name: input.name,
        description: input.description,
        category: input.category,
        tags: input.tags || [],
        nodes: JSON.stringify([]),
        edges: JSON.stringify([]),
        status: "DRAFT",
      },
    });

    logger.info({
      type: "workflow_created",
      userId: user.id,
      workflowId: workflow.id,
      name: workflow.name,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`dashboard:stats:${user.id}`);
    }

    revalidatePath("/workflows");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: workflow.id },
    };
  } catch (error) {
    logError(error, { type: "create_workflow_failed" });
    return { success: false, error: "Failed to create workflow" };
  }
}

/**
 * Update workflow
 */
export async function updateWorkflow(
  input: UpdateWorkflowInput
): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await prisma.workflow.findFirst({
      where: {
        id: input.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return { success: false, error: "Workflow not found" };
    }

    await prisma.workflow.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        tags: input.tags,
        status: input.status,
        updatedAt: new Date(),
      },
    });

    logger.info({
      type: "workflow_updated",
      userId: user.id,
      workflowId: input.id,
    });

    revalidatePath(`/workflows/${input.id}`);
    revalidatePath("/workflows");

    return { success: true };
  } catch (error) {
    logError(error, { type: "update_workflow_failed", workflowId: input.id });
    return { success: false, error: "Failed to update workflow" };
  }
}

/**
 * Delete workflow
 */
export async function deleteWorkflow(id: string): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    // Delete workflow and cascade to executions
    await prisma.workflow.delete({
      where: { id },
    });

    logger.info({
      type: "workflow_deleted",
      userId: user.id,
      workflowId: id,
      name: workflow.name,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`dashboard:stats:${user.id}`);
    }

    revalidatePath("/workflows");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    logError(error, { type: "delete_workflow_failed", workflowId: id });
    return { success: false, error: "Failed to delete workflow" };
  }
}

/**
 * Bulk actions on workflows
 */
export async function bulkWorkflowAction(
  action: BulkWorkflowAction
): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership of all workflows
    const workflows = await prisma.workflow.findMany({
      where: {
        id: { in: action.workflowIds },
        userId: user.id,
      },
      select: { id: true },
    });

    if (workflows.length !== action.workflowIds.length) {
      return { success: false, error: "Some workflows not found" };
    }

    switch (action.action) {
      case "delete":
        await prisma.workflow.deleteMany({
          where: {
            id: { in: action.workflowIds },
            userId: user.id,
          },
        });
        break;

      case "archive":
        await prisma.workflow.updateMany({
          where: {
            id: { in: action.workflowIds },
            userId: user.id,
          },
          data: {
            status: "ARCHIVED",
            archivedAt: new Date(),
          },
        });
        break;

      case "publish":
        await prisma.workflow.updateMany({
          where: {
            id: { in: action.workflowIds },
            userId: user.id,
          },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });
        break;

      case "pause":
        await prisma.workflow.updateMany({
          where: {
            id: { in: action.workflowIds },
            userId: user.id,
          },
          data: {
            status: "PAUSED",
          },
        });
        break;
    }

    logger.info({
      type: "bulk_workflow_action",
      userId: user.id,
      action: action.action,
      count: action.workflowIds.length,
    });

    // Invalidate cache
    if (redis.isAvailable()) {
      await redis.del(`dashboard:stats:${user.id}`);
    }

    revalidatePath("/workflows");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    logError(error, { type: "bulk_workflow_action_failed", action });
    return { success: false, error: `Failed to ${action.action} workflows` };
  }
}

/**
 * Duplicate workflow
 */
export async function duplicateWorkflow(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const original = await prisma.workflow.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!original) {
      return { success: false, error: "Workflow not found" };
    }

    const duplicate = await prisma.workflow.create({
      data: {
        userId: user.id,
        name: `${original.name} (Copy)`,
        description: original.description,
        category: original.category,
        tags: original.tags,
        nodes: original.nodes as any,
        edges: original.edges as any,
        variables: original.variables as any,
        timeout: original.timeout,
        retryPolicy: original.retryPolicy as any,
        maxRetries: original.maxRetries,
        status: "DRAFT",
      },
    });

    logger.info({
      type: "workflow_duplicated",
      userId: user.id,
      originalId: id,
      duplicateId: duplicate.id,
    });

    revalidatePath("/workflows");

    return {
      success: true,
      data: { id: duplicate.id },
    };
  } catch (error) {
    logError(error, { type: "duplicate_workflow_failed", workflowId: id });
    return { success: false, error: "Failed to duplicate workflow" };
  }
}
