// src/app/(main)/components/(workflows)/editor/NodeConfigDialog.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";
import { getNodeDefinition } from "@/lib/utils/node-registry";

interface NodeConfigDialogProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onExecute?: (nodeId: string) => Promise<void>;
  children: React.ReactNode;
}

export function NodeConfigDialog({
  node,
  isOpen,
  onClose,
  onUpdate,
  onExecute,
  children,
}: NodeConfigDialogProps) {
  if (!node) return null;

  const definition = getNodeDefinition(node.type);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleExecute = async () => {
    if (!onExecute || isExecuting) return;
    setIsExecuting(true);
    try {
      await onExecute(node.id);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Main Dialog - 90% screen coverage */}
        <Dialog.Content
          className="fixed left-[5%] top-[5%] z-50 w-[90vw] h-[90vh] bg-[#1e1e1e] border border-[#2a2a2a] shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center text-[#919298]">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">
                  {definition.label}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#919298] mt-0.5">
                  {definition.category}
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white gap-2"
              >
                <Play className="w-4 h-4" />
                Execute step
              </Button>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#919298] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </Dialog.Close>
            </div>
          </div>

          {/* Main Content - 12 column grid */}
          <div className="flex-1 overflow-hidden">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 12-column grid container for node configs
export function NodeConfigGrid({
  children,
  layout = "full", // full: 4-4-4, output-only: 4-8, input-only: 8-4
}: {
  children: React.ReactNode;
  layout?: "full" | "output-only" | "input-only";
}) {
  return (
    <div className="h-full grid grid-cols-12 divide-x divide-[#2a2a2a]">
      {children}
    </div>
  );
}

// Column components with fixed widths
export function InputColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-4 bg-[#1a1a1a] overflow-y-auto">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          INPUT
        </h3>
        {children}
      </div>
    </div>
  );
}

export function ParametersColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-4 bg-[#1e1e1e] overflow-y-auto">
      <div className="p-6">{children}</div>
    </div>
  );
}

export function OutputColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-4 bg-[#1a1a1a] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            OUTPUT
          </h3>
          <button className="text-[#919298] hover:text-white">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
