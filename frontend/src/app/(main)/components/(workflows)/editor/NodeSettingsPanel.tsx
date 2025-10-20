"use client";

import { X, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";
import { getNodeDefinition } from "@/lib/utils/node-registry";

// Panel imports (lazy loaded for performance)
import { lazy, Suspense } from "react";

// Eager-loaded panels (frequently used)
import { TriggerPanel } from "./panels/TriggerPanel";
import { OpenURLPanel } from "./panels/web-automation/OpenURLPanel";

// Lazy-loaded panels
// const AIAgentPanel = lazy(() =>
//   import("./panels/ai/AIAgentPanel").then((m) => ({ default: m.AIAgentPanel }))
// );
// const OpenURLPanel = lazy(() =>
//   import("./panels/web-automation/OpenURLPanel").then((m) => ({
//     default: m.OpenURLPanel,
//   }))
// );
// const ClickElementPanel = lazy(() =>
//   import("./panels/web-automation/ClickElementPanel").then((m) => ({
//     default: m.ClickElementPanel,
//   }))
// );
// const FillInputPanel = lazy(() =>
//   import("./panels/web-automation/FillInputPanel").then((m) => ({
//     default: m.FillInputPanel,
//   }))
// );
// const HTTPRequestPanel = lazy(() =>
//   import("./panels/utility/HTTPRequestPanel").then((m) => ({
//     default: m.HTTPRequestPanel,
//   }))
// );
const SetVariablePanel = lazy(() =>
  import("./panels/general/SetVariablePanel").then((m) => ({
    default: m.SetVariablePanel,
  }))
);

// Panel loading fallback
const PanelLoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

// Default panel for nodes without specific implementation
const DefaultPanel = ({ node }: { node: WorkflowNode }) => {
  const definition = getNodeDefinition(node.type);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-2">
          Under Construction
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          The configuration panel for <strong>{definition.label}</strong> is
          being developed.
        </p>
        <div className="space-y-2 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Node Type:</span>
            <code className="bg-slate-900 px-2 py-0.5 rounded">
              {node.type}
            </code>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <Badge variant="outline" className="text-xs">
              {definition.category}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Node ID:</span>
            <code className="bg-slate-900 px-2 py-0.5 rounded text-[10px]">
              {node.id.slice(0, 8)}...
            </code>
          </div>
        </div>
      </div>

      {definition.description && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-2">
            Description
          </h4>
          <p className="text-sm text-slate-300">{definition.description}</p>
        </div>
      )}

      {definition.outputSchema && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-2">
            Output Schema
          </h4>
          <pre className="text-xs bg-slate-900 p-3 rounded overflow-x-auto">
            {JSON.stringify(definition.outputSchema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

interface NodeSettingsPanelProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeSettingsPanel({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: NodeSettingsPanelProps) {
  if (!node) return null;

  const definition = getNodeDefinition(node.type);

  const handleUpdate = (data: Partial<WorkflowNode["data"]>) => {
    onUpdate(node.id, data);
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  // Panel routing with lazy loading
  const renderPanel = () => {
    const commonProps = { node, onUpdate: handleUpdate };

    switch (node.type) {
      // Core (eager loaded)
      case "trigger":
        return <TriggerPanel {...commonProps} />;

      case "openURL":
        return <OpenURLPanel {...commonProps} />;

      // AI (lazy loaded)
      // case "aiAgent":
      //   return (
      //     <Suspense fallback={<PanelLoadingFallback />}>
      //       <AIAgentPanel {...commonProps} />
      //     </Suspense>
      //   );

      // // Web Automation (lazy loaded)
      // case "openURL":
      //   return (
      //     <Suspense fallback={<PanelLoadingFallback />}>
      //       <OpenURLPanel {...commonProps} />
      //     </Suspense>
      //   );
      // case "clickElement":
      //   return (
      //     <Suspense fallback={<PanelLoadingFallback />}>
      //       <ClickElementPanel {...commonProps} />
      //     </Suspense>
      //   );
      // case "fillInput":
      //   return (
      //     <Suspense fallback={<PanelLoadingFallback />}>
      //       <FillInputPanel {...commonProps} />
      //     </Suspense>
      //   );

      // // Utility (lazy loaded)
      // case "httpRequest":
      //   return (
      //     <Suspense fallback={<PanelLoadingFallback />}>
      //       <HTTPRequestPanel {...commonProps} />
      //     </Suspense>
      //   );

      // General (lazy loaded)
      case "setVariable":
        return (
          <Suspense fallback={<PanelLoadingFallback />}>
            <SetVariablePanel {...commonProps} />
          </Suspense>
        );

      // Fallback for unimplemented panels
      default:
        return <DefaultPanel node={node} />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[480px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold text-white truncate">
                {definition.label}
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400 mt-1">
                {definition.category} • {node.type}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 mt-3">
            <Badge
              variant={node.data.enabled ? "default" : "secondary"}
              className="text-xs"
            >
              {node.data.enabled ? "Enabled" : "Disabled"}
            </Badge>
            {node.data.executionState &&
              node.data.executionState !== "idle" && (
                <Badge
                  variant={
                    node.data.executionState === "success"
                      ? "default"
                      : node.data.executionState === "error"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {node.data.executionState}
                </Badge>
              )}
            {node.data.errors && node.data.errors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {node.data.errors.length} error
                {node.data.errors.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Panel Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">{renderPanel()}</div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                disabled={node.type === "trigger"}
              >
                <Trash2 className="h-4 w-4" />
                Delete Node
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {definition.label}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this node and all its connections.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={onClose} size="sm">
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
