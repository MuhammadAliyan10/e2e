"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatDistanceToNow } from "date-fns";
import { Search, ArrowUpDown } from "lucide-react";
import type { WorkflowFilters, WorkflowSort } from "@/lib/types/workflow.types";
import { WorkflowCategory, WorkflowStatus } from "@prisma/client";
import { useWorkflows } from "@/lib/hooks/use-workflow";
import { WorkflowStatsWidget } from "./WorkflowStatsWidget";
import { WorkflowActions } from "./header/WorkflowActions";
import { WorkflowStatusBadge } from "./WorkflowStatusBadge";
import { WorkflowRowActions } from "./header/WorkflowRowActions";

export function WorkflowsTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<WorkflowCategory[]>([]);
  const [sort, setSort] = useState<WorkflowSort>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filters: WorkflowFilters = {
    search: search || undefined,
    status: statusFilter.length > 0 ? statusFilter : undefined,
    category: categoryFilter.length > 0 ? categoryFilter : undefined,
  };

  const { data, isLoading, error } = useWorkflows(
    page,
    pageSize,
    filters,
    sort
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (!data?.workflows) return;

    if (selectedIds.length === data.workflows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.workflows.map((w) => w.id));
    }
  };

  const handleSort = (field: WorkflowSort["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">
            Failed to load workflows. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const workflows = data?.workflows || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <WorkflowStatsWidget />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Workflows</CardTitle>
              <CardDescription>
                {total} {total === 1 ? "workflow" : "workflows"} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter[0] || "all"}
                onValueChange={(value) => {
                  setStatusFilter(
                    value === "all" ? [] : [value as WorkflowStatus]
                  );
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter[0] || "all"}
                onValueChange={(value) => {
                  setCategoryFilter(
                    value === "all" ? [] : [value as WorkflowCategory]
                  );
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="DATA_EXTRACTION">
                    Data Extraction
                  </SelectItem>
                  <SelectItem value="FORM_SUBMISSION">
                    Form Submission
                  </SelectItem>
                  <SelectItem value="MONITORING">Monitoring</SelectItem>
                  <SelectItem value="TESTING">Testing</SelectItem>
                  <SelectItem value="INTEGRATION">Integration</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedIds.length > 0 && (
            <WorkflowActions
              selectedIds={selectedIds}
              onClearSelection={() => setSelectedIds([])}
            />
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      workflows.length > 0 &&
                      selectedIds.length === workflows.length
                    }
                    onCheckedChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1"
                  >
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("totalRuns")}
                    className="flex items-center gap-1 ml-auto"
                  >
                    Runs
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("lastRunAt")}
                    className="flex items-center gap-1"
                  >
                    Last Run
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-muted-foreground">
                        Loading workflows...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : workflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        {search ||
                        statusFilter.length > 0 ||
                        categoryFilter.length > 0
                          ? "No workflows match your filters"
                          : "No workflows yet"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter([]);
                          setCategoryFilter([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                workflows.map((workflow) => {
                  const successRate =
                    workflow.totalRuns > 0
                      ? (
                          (workflow.successRuns / workflow.totalRuns) *
                          100
                        ).toFixed(1)
                      : "0.0";

                  return (
                    <TableRow
                      key={workflow.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        (window.location.href = `/workflows/${workflow.id}`)
                      }
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(workflow.id)}
                          onCheckedChange={() => toggleSelection(workflow.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{workflow.name}</p>
                          {workflow.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {workflow.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {workflow.category || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <WorkflowStatusBadge status={workflow.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {workflow.totalRuns}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            parseFloat(successRate) >= 90
                              ? "text-green-600"
                              : parseFloat(successRate) < 70
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {successRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {workflow.lastRunAt ? (
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(workflow.lastRunAt), {
                              addSuffix: true,
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WorkflowRowActions workflow={workflow} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, total)} of {total} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
