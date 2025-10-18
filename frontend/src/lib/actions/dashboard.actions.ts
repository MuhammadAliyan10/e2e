"use server";

import { prisma } from "@/lib/prisma";

import { logError } from "@/lib/logger";
import { getCurrentUser } from "./global.actions";
import { eachDayOfInterval, format } from "date-fns";

export async function getExecutionHeatmap(year: number, month: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized", data: [] };
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const executions = await prisma.execution.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const heatmap = dateRange.map((date) => {
      const dayExecutions = executions.filter((e) => {
        const execDate = new Date(e.createdAt);
        return execDate.toDateString() === date.toDateString();
      });

      return {
        date: format(date, "yyyy-MM-dd"),
        count: dayExecutions.length,
      };
    });

    return { success: true, data: heatmap };
  } catch (error) {
    logError(error, { type: "get_execution_heatmap_failed" });
    return { success: false, error: "Failed to fetch heatmap", data: [] };
  }
}
