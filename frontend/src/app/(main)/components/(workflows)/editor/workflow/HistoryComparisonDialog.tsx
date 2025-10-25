// src/app/(main)/components/(workflows)/editor/workflow/HistoryComparisonDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import type { Node } from "reactflow";
import type { DataEdge } from "@/lib/types/workflow-nodes.types";

interface HistoryState {
  nodes: Node[];
  edges: DataEdge[];
  timestamp: number;
  description?: string;
}

interface HistoryComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  previousState: HistoryState | null;
  currentState: HistoryState | null;
  onApply: (targetIndex: number) => void;
  currentIndex: number;
}

export function HistoryComparisonDialog({
  isOpen,
  onClose,
  previousState,
  currentState,
  onApply,
  currentIndex,
}: HistoryComparisonDialogProps) {
  if (!previousState || !currentState) return null;

  const isUndo = previousState.timestamp < currentState.timestamp;
  const targetIndex = isUndo ? currentIndex - 1 : currentIndex + 1;

  const getNodeDiff = () => {
    const prevNodeIds = new Set(previousState.nodes.map((n) => n.id));
    const currNodeIds = new Set(currentState.nodes.map((n) => n.id));

    const added = currentState.nodes.filter((n) => !prevNodeIds.has(n.id));
    const removed = previousState.nodes.filter((n) => !currNodeIds.has(n.id));
    const modified = currentState.nodes.filter((n) => {
      const prevNode = previousState.nodes.find((pn) => pn.id === n.id);
      return (
        prevNode && JSON.stringify(prevNode.data) !== JSON.stringify(n.data)
      );
    });

    return { added, removed, modified };
  };

  const getEdgeDiff = () => {
    const prevEdgeIds = new Set(previousState.edges.map((e) => e.id));
    const currEdgeIds = new Set(currentState.edges.map((e) => e.id));

    const added = currentState.edges.filter((e) => !prevEdgeIds.has(e.id));
    const removed = previousState.edges.filter((e) => !currEdgeIds.has(e.id));

    return { added, removed };
  };

  const nodeDiff = getNodeDiff();
  const edgeDiff = getEdgeDiff();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-[#1e1e1e] border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUndo ? (
              <>
                <ArrowLeft className="h-5 w-5" />
                Undo Changes
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5" />
                Redo Changes
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-[#919298]">
            Review changes before applying {isUndo ? "undo" : "redo"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Timeline */}
            <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-white">Previous State</div>
                <div className="text-xs text-[#919298]">
                  {formatDistanceToNow(previousState.timestamp, {
                    addSuffix: true,
                  })}
                </div>
                {previousState.description && (
                  <div className="text-xs text-[#606060] mt-1">
                    {previousState.description}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isUndo ? (
                  <ArrowLeft className="h-4 w-4 text-[#919298]" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-[#919298]" />
                )}
              </div>

              <div className="text-sm">
                <div className="font-medium text-white">Current State</div>
                <div className="text-xs text-[#919298]">
                  {formatDistanceToNow(currentState.timestamp, {
                    addSuffix: true,
                  })}
                </div>
                {currentState.description && (
                  <div className="text-xs text-[#606060] mt-1">
                    {currentState.description}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#2a2a2a]" />

            {/* Node Changes */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Node Changes
              </h3>

              {nodeDiff.added.length > 0 && (
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-green-500/10 text-green-400 border-green-500/30"
                  >
                    +{nodeDiff.added.length} Added
                  </Badge>
                  <ul className="space-y-1 text-xs text-[#919298]">
                    {nodeDiff.added.map((node) => (
                      <li key={node.id} className="flex items-center gap-2">
                        <span className="text-green-400">+</span>
                        {node.data.label || node.type} ({node.id.slice(0, 8)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nodeDiff.removed.length > 0 && (
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-red-500/10 text-red-400 border-red-500/30"
                  >
                    -{nodeDiff.removed.length} Removed
                  </Badge>
                  <ul className="space-y-1 text-xs text-[#919298]">
                    {nodeDiff.removed.map((node) => (
                      <li key={node.id} className="flex items-center gap-2">
                        <span className="text-red-400">-</span>
                        {node.data.label || node.type} ({node.id.slice(0, 8)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nodeDiff.modified.length > 0 && (
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  >
                    ~{nodeDiff.modified.length} Modified
                  </Badge>
                  <ul className="space-y-1 text-xs text-[#919298]">
                    {nodeDiff.modified.map((node) => (
                      <li key={node.id} className="flex items-center gap-2">
                        <span className="text-yellow-400">~</span>
                        {node.data.label || node.type} ({node.id.slice(0, 8)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nodeDiff.added.length === 0 &&
                nodeDiff.removed.length === 0 &&
                nodeDiff.modified.length === 0 && (
                  <p className="text-sm text-[#606060]">No node changes</p>
                )}
            </div>

            <Separator className="bg-[#2a2a2a]" />

            {/* Edge Changes */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Connection Changes
              </h3>

              {edgeDiff.added.length > 0 && (
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-green-500/10 text-green-400 border-green-500/30"
                  >
                    +{edgeDiff.added.length} Added
                  </Badge>
                  <ul className="space-y-1 text-xs text-[#919298]">
                    {edgeDiff.added.map((edge) => (
                      <li key={edge.id} className="flex items-center gap-2">
                        <span className="text-green-400">+</span>
                        {edge.source.slice(0, 8)} → {edge.target.slice(0, 8)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {edgeDiff.removed.length > 0 && (
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-red-500/10 text-red-400 border-red-500/30"
                  >
                    -{edgeDiff.removed.length} Removed
                  </Badge>
                  <ul className="space-y-1 text-[#919298]">
                    {edgeDiff.removed.map((edge) => (
                      <li key={edge.id} className="flex items-center gap-2">
                        <span className="text-red-400">-</span>
                        {edge.source.slice(0, 8)} → {edge.target.slice(0, 8)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {edgeDiff.added.length === 0 && edgeDiff.removed.length === 0 && (
                <p className="text-sm text-[#606060]">No connection changes</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onApply(targetIndex)}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Check className="h-4 w-4" />
            Apply {isUndo ? "Undo" : "Redo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
