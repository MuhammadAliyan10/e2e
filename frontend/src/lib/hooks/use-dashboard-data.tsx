"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentActivity,
} from "@/lib/actions/global.actions";
import {
  getExecutionTrends,
  getWorkflowPerformance,
  getCategoryDistribution,
  getRealTimeMetrics,
} from "@/lib/actions/dashboard.actions";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const result = await getDashboardStats();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useExecutionTrends(days: number = 30) {
  return useQuery({
    queryKey: ["dashboard", "trends", days],
    queryFn: async () => {
      const result = await getExecutionTrends(days);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkflowPerformance() {
  return useQuery({
    queryKey: ["dashboard", "performance"],
    queryFn: async () => {
      const result = await getWorkflowPerformance();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryDistribution() {
  return useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: async () => {
      const result = await getCategoryDistribution();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useRealTimeMetrics() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["dashboard", "realtime"],
    queryFn: async () => {
      const result = await getRealTimeMetrics();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    refetchInterval: 10 * 1000, // Every 10 seconds
    staleTime: 0, // Always fresh
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: async () => {
      const result = await getRecentActivity(limit);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
