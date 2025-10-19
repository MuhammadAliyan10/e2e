"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  bulkWorkflowAction,
  duplicateWorkflow,
} from "@/lib/actions/workflow.actions";
import type {
  WorkflowFilters,
  WorkflowSort,
  CreateWorkflowInput,
  UpdateWorkflowInput,
  BulkWorkflowAction,
} from "@/lib/types/workflow.types";

export function useWorkflows(
  page: number = 1,
  pageSize: number = 10,
  filters?: WorkflowFilters,
  sort?: WorkflowSort
) {
  return useQuery({
    queryKey: ["workflows", page, pageSize, filters, sort],
    queryFn: async () => {
      const result = await getWorkflows(page, pageSize, filters, sort);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: async () => {
      const result = await getWorkflow(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateWorkflowInput) => {
      const result = await createWorkflow(input);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow created successfully");
      router.push(`/dashboard/workflows/${data.id}/edit`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create workflow");
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateWorkflowInput) => {
      const result = await updateWorkflow(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", variables.id] });
      toast.success("Workflow updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update workflow");
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteWorkflow(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete workflow");
    },
  });
}

export function useBulkWorkflowAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: BulkWorkflowAction) => {
      const result = await bulkWorkflowAction(action);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success(
        `${variables.workflowIds.length} workflows ${variables.action}d`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to perform bulk action");
    },
  });
}

export function useDuplicateWorkflow() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await duplicateWorkflow(id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow duplicated successfully");
      router.push(`/dashboard/workflows/${data.id}/edit`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to duplicate workflow");
    },
  });
}
