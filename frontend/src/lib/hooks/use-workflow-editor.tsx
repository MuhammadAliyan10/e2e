"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loadWorkflowGraph,
  saveWorkflowGraph,
  validateWorkflowGraph,
} from "@/lib/actions/workflow-editor.actions";
import { getWorkflow } from "@/lib/actions/workflow.actions";
import type { WorkflowGraph } from "@/lib/types/workflow-editor.types";
import { toast } from "sonner";

export function useWorkflowEditor(workflowId: string) {
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<Date>();

  // Load workflow metadata
  const { data: workflow, isLoading: isLoadingWorkflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      const result = await getWorkflow(workflowId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    retry: 1,
  });

  // Load workflow graph
  const { data: graph, isLoading: isLoadingGraph } = useQuery({
    queryKey: ["workflow-graph", workflowId],
    queryFn: async () => {
      const result = await loadWorkflowGraph(workflowId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    retry: 1,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (graphData: WorkflowGraph) => {
      const result = await saveWorkflowGraph(workflowId, graphData);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-graph", workflowId],
      });
      setLastSaved(new Date());
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save workflow");
    },
  });

  // Validate mutation
  const validateMutation = useMutation({
    mutationFn: async () => {
      const result = await validateWorkflowGraph(workflowId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const saveWorkflow = useCallback(
    (graphData: WorkflowGraph) => {
      saveMutation.mutate(graphData);
    },
    [saveMutation]
  );

  const validateWorkflow = useCallback(() => {
    return validateMutation.mutateAsync();
  }, [validateMutation]);

  // Merge workflow metadata with graph data
  const mergedWorkflow = graph
    ? {
        ...workflow,
        nodes: graph.nodes,
        edges: graph.edges,
        variables: graph.variables,
        version: graph.version,
      }
    : workflow;

  return {
    workflow: mergedWorkflow,
    isLoading: isLoadingWorkflow || isLoadingGraph,
    saveWorkflow,
    isSaving: saveMutation.isPending,
    validateWorkflow,
    isValidating: validateMutation.isPending,
    lastSaved,
  };
}
