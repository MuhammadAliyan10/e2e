// src/app/(main)/components/(workflows)/editor/workflow/WorkflowEditor.tsx
"use client";

import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  NodeTypes,
  EdgeTypes,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  AlertCircle,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Crosshair,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Local imports
import { useWorkflowEditor } from "@/lib/hooks/use-workflow-editor";
import {
  createNodeSafe,
  validateNodeConnection,
  validateWorkflowGraph,
} from "@/lib/utils/node-factory";
import { isValidNodeType } from "@/lib/utils/node-registry";
import { isTemporaryWorkflowId } from "@/lib/utils/workflow-id";
import type {
  NodeType,
  WorkflowNode,
  DataEdge,
  WorkflowGraph,
} from "@/lib/types/workflow-nodes.types";

// Components
import { DataEdge as DataEdgeComponent } from "../edges/DataEdge";
import { AddNodeSheet } from "../AddNodeSheet";
import { AiWorkflowGeneratorSheet } from "./AiWorkflowGeneratorSheet";
import { NodeSettingsPanel } from "../NodeSettingsPanel";
import { HistoryComparisonDialog } from "./HistoryComparisonDialog";
import { WorkflowNavbar } from "./WorkflowNavbar";
import OnClickTriggerNode from "../nodes/trigger/OnClickTriggerNode";

import { useRouter } from "next/navigation";
import ClickElementNode from "../nodes/browser/ClickElementNode";

// Constants
const HISTORY_STORAGE_KEY = "workflow-editor-history";
const MAX_HISTORY_SIZE = 50;
const AUTO_SAVE_DEBOUNCE_MS = 3000;
const PERIODIC_SAVE_INTERVAL_MS = 5 * 60 * 1000;

// Types
interface WorkflowEditorContentProps {
  workflowId: string;
}

interface PendingEdge {
  sourceNodeId: string;
  sourceHandleId: string;
  sourceX: number;
  sourceY: number;
}

interface HistoryState {
  nodes: Node[];
  edges: DataEdge[];
  timestamp: number;
  description?: string;
}

// Node & Edge Types
const nodeTypes: NodeTypes = {
  trigger: OnClickTriggerNode,
  clickElement: ClickElementNode,
};

const edgeTypes: EdgeTypes = {
  default: DataEdgeComponent,
  custom: DataEdgeComponent,
};

// Utility Functions
function parseWorkflowNodes(nodes: unknown): Node[] {
  try {
    if (Array.isArray(nodes)) return nodes;
    if (typeof nodes === "string") {
      const parsed = JSON.parse(nodes);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("[WorkflowEditor] Failed to parse nodes:", error);
    return [];
  }
}

function parseWorkflowEdges(edges: unknown): DataEdge[] {
  try {
    if (Array.isArray(edges)) return edges;
    if (typeof edges === "string") {
      const parsed = JSON.parse(edges);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("[WorkflowEditor] Failed to parse edges:", error);
    return [];
  }
}

function generateWorkflowHash(nodes: Node[], edges: DataEdge[]): string {
  const state = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };
  return JSON.stringify(state);
}

function validateWorkflowImport(graph: WorkflowGraph): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!graph.nodes || !Array.isArray(graph.nodes)) {
    errors.push("Missing or invalid 'nodes' array");
  }
  if (!graph.edges || !Array.isArray(graph.edges)) {
    errors.push("Missing or invalid 'edges' array");
  }

  graph.nodes?.forEach((node: any, idx: number) => {
    if (!node.id) errors.push(`Node ${idx}: missing 'id'`);
    if (!node.type || !isValidNodeType(node.type))
      errors.push(`Node ${idx}: invalid type`);
    if (!node.position || typeof node.position.x !== "number")
      errors.push(`Node ${idx}: invalid position`);
  });

  graph.edges?.forEach((edge: any, idx: number) => {
    if (!edge.source) errors.push(`Edge ${idx}: missing 'source'`);
    if (!edge.target) errors.push(`Edge ${idx}: missing 'target'`);
  });

  return { valid: errors.length === 0, errors };
}

function saveHistoryToStorage(
  workflowId: string,
  history: HistoryState[]
): void {
  try {
    localStorage.setItem(
      `${HISTORY_STORAGE_KEY}-${workflowId}`,
      JSON.stringify(history)
    );
  } catch (error) {
    console.warn("[WorkflowEditor] Failed to persist history:", error);
  }
}

function loadHistoryFromStorage(workflowId: string): HistoryState[] {
  try {
    const stored = localStorage.getItem(`${HISTORY_STORAGE_KEY}-${workflowId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("[WorkflowEditor] Failed to load history:", error);
  }
  return [];
}

async function generateAiWorkflow(): Promise<{
  nodes: WorkflowNode[];
  edges: DataEdge[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const triggerNode = createNodeSafe("trigger", {
    position: { x: 100, y: 100 },
  });
  return { nodes: [triggerNode], edges: [] };
}

// Main Component
function WorkflowEditorContent({ workflowId }: WorkflowEditorContentProps) {
  const router = useRouter();
  const { workflow, isLoading, saveWorkflow, isSaving, lastSaved } =
    useWorkflowEditor(workflowId);
  const reactFlowInstance = useReactFlow();

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<DataEdge>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState(workflowId);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [pendingEdge, setPendingEdge] = useState<PendingEdge | null>(null);
  const [lastSavedHash, setLastSavedHash] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isApplyingHistory, setIsApplyingHistory] = useState(false);
  const [showHistoryComparison, setShowHistoryComparison] = useState(false);
  const [comparisonStates, setComparisonStates] = useState<{
    previous: HistoryState | null;
    current: HistoryState | null;
  }>({ previous: null, current: null });

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const periodicSaveTimerRef = useRef<NodeJS.Timeout>();
  const historySaveTimerRef = useRef<NodeJS.Timeout>();

  // Callbacks
  const handleNodeAddClick = useCallback(
    (sourceNodeId: string, sourceHandleId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      setPendingEdge({
        sourceNodeId,
        sourceHandleId,
        sourceX: sourceNode?.position.x || 0,
        sourceY: sourceNode?.position.y || 0,
      });
      setIsAddNodeOpen(true);
    },
    [nodes]
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? ({ ...node, data: { ...node.data, ...data } } as Node)
            : node
        )
      );
    },
    [setNodes]
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      const nodeToDelete = nodes.find((n) => n.id === nodeId);
      if (nodeToDelete?.type === "trigger") {
        toast.error("Cannot delete the trigger node");
        return;
      }
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      setSelectedNode(null);
      setIsPanelOpen(false);
      toast.success("Node deleted");
    },
    [nodes, setNodes, setEdges]
  );

  const saveToHistory = useCallback(
    (description?: string) => {
      if (isApplyingHistory || nodes.length === 0) return;

      const currentState: HistoryState = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
        description,
      };

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift();
        return newHistory;
      });

      setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
    },
    [nodes, edges, historyIndex, isApplyingHistory]
  );

  const handleAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      const result = await saveWorkflow({
        nodes: nodes as WorkflowNode[],
        edges,
        variables: workflow?.variables || {},
        version: workflow?.version || 1,
      });

      if (
        result?.isNew &&
        result?.id &&
        isTemporaryWorkflowId(currentWorkflowId)
      ) {
        setCurrentWorkflowId(result.id);
        router.replace(`/workflows/${result.id}`);
      }

      setLastSavedHash(generateWorkflowHash(nodes, edges as DataEdge[]));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("[WorkflowEditor] Auto-save failed:", error);
      toast.error("Failed to auto-save workflow");
    }
  }, [
    nodes,
    edges,
    workflow,
    currentWorkflowId,
    saveWorkflow,
    router,
    hasUnsavedChanges,
  ]);

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return;

      const validation = validateNodeConnection(
        sourceNode as WorkflowNode,
        targetNode as WorkflowNode
      );
      if (!validation.valid) {
        toast.error(validation.errors?.[0] || "Invalid connection");
        return;
      }

      const newEdge: DataEdge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        type: "custom",
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed },
        data: { label: connection.sourceHandle || undefined },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory("Connected nodes");
      toast.success("Connection created");
    },
    [nodes, setEdges, saveToHistory]
  );

  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      try {
        const position = pendingEdge
          ? { x: pendingEdge.sourceX + 250, y: pendingEdge.sourceY }
          : reactFlowInstance.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            });

        const newNode = createNodeSafe(nodeType, { position, validate: false });
        setNodes((nds) => [...nds, newNode as Node]);

        if (pendingEdge) {
          const newEdge: DataEdge = {
            id: `e${pendingEdge.sourceNodeId}-${newNode.id}`,
            source: pendingEdge.sourceNodeId,
            target: newNode.id,
            sourceHandle: pendingEdge.sourceHandleId,
            type: "custom",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: {
              label:
                pendingEdge.sourceHandleId !== "output"
                  ? pendingEdge.sourceHandleId
                  : undefined,
            },
          };
          setEdges((eds) => [...eds, newEdge]);
          setPendingEdge(null);
        }

        setSelectedNode(newNode);
        setIsPanelOpen(true);
        setIsAddNodeOpen(false);
        saveToHistory(`Added ${newNode.data.label} node`);
        toast.success(`${newNode.data.label} node added`);
      } catch (error) {
        console.error("[WorkflowEditor] Failed to add node:", error);
        toast.error("Failed to add node");
      }
    },
    [reactFlowInstance, setNodes, setEdges, pendingEdge, saveToHistory]
  );

  // Effects
  useEffect(() => {
    if (!currentWorkflowId) return;
    const storedHistory = loadHistoryFromStorage(currentWorkflowId);
    if (storedHistory.length > 0) {
      setHistory(storedHistory);
      setHistoryIndex(storedHistory.length - 1);
    }
  }, [currentWorkflowId]);

  useEffect(() => {
    if (hasInitialized) return;

    try {
      if (workflow?.nodes && workflow?.edges) {
        const loadedNodes = parseWorkflowNodes(workflow.nodes);
        const loadedEdges = parseWorkflowEdges(workflow.edges);
        const validNodes = loadedNodes.filter(
          (node: any) => node && isValidNodeType(node.type)
        );

        const hasTrigger = validNodes.some((n: any) => n.type === "trigger");
        const finalNodes = hasTrigger
          ? validNodes
          : [
              createNodeSafe("trigger", {
                position: { x: 100, y: 100 },
              }) as Node,
              ...validNodes,
            ];

        setNodes(finalNodes);
        setEdges(loadedEdges);
        setWorkflowName(workflow.name || "Untitled Workflow");
        setLastSavedHash(generateWorkflowHash(finalNodes, loadedEdges));
        setHasUnsavedChanges(false);
        setHasInitialized(true);
      } else {
        const triggerNode = createNodeSafe("trigger", {
          position: { x: 100, y: 100 },
        }) as Node;
        setNodes([triggerNode]);
        setLastSavedHash(generateWorkflowHash([triggerNode], []));
        setHasUnsavedChanges(false);
        setHasInitialized(true);
      }
    } catch (error) {
      console.error("[WorkflowEditor] Initialization error:", error);
      const triggerNode = createNodeSafe("trigger", {
        position: { x: 100, y: 100 },
      }) as Node;
      setNodes([triggerNode]);
      setHasInitialized(true);
    }
  }, [workflow, hasInitialized, setNodes, setEdges]);

  useEffect(() => {
    if (!hasInitialized || isApplyingHistory || nodes.length === 0) return;
    const currentHash = generateWorkflowHash(nodes, edges as DataEdge[]);
    setHasUnsavedChanges(currentHash !== lastSavedHash);
  }, [nodes, edges, lastSavedHash, hasInitialized, isApplyingHistory]);

  useEffect(() => {
    if (!hasInitialized || !hasUnsavedChanges) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      const validation = validateWorkflowGraph(nodes as WorkflowNode[], edges);
      setValidationErrors(validation.valid ? [] : validation.errors);
      handleAutoSave();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [hasUnsavedChanges, hasInitialized, handleAutoSave]);

  useEffect(() => {
    const nodeIds = nodes.map((n) => n.id).join(",");
    const needsUpdate = nodes.some(
      (node) => !(node as WorkflowNode).data.onAddNode
    );
    if (!needsUpdate) return;

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddNode: handleNodeAddClick,
          onConfigure: () => {
            setSelectedNode(node as WorkflowNode);
            setIsPanelOpen(true);
          },
          onUpdate: (updates: Partial<WorkflowNode["data"]>) =>
            handleNodeUpdate(node.id, updates),
          onDelete: () => handleNodeDelete(node.id),
        },
      }))
    );
  }, [
    nodes.length,
    handleNodeAddClick,
    handleNodeUpdate,
    handleNodeDelete,
    setNodes,
  ]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#2E2E2E]/50 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-white">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#1a1a1a]">
      <WorkflowNavbar
        workflowId={currentWorkflowId}
        workflowName={workflowName}
        workflowStatus={workflow?.status}
        nodeCount={nodes.length}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSave={async () => {
          const result = await saveWorkflow({
            nodes: nodes as WorkflowNode[],
            edges,
            variables: {},
            version: 1,
            name: workflowName,
          });
          if (result?.id) setLastSavedHash(generateWorkflowHash(nodes, edges));
          toast.success("Workflow saved");
        }}
        onRun={() => toast.info("Execution started")}
        onExport={() => {
          const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `workflow-${workflowName}-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Workflow exported");
        }}
        onImport={(graph: WorkflowGraph) => {
          const validation = validateWorkflowImport(graph);
          if (!validation.valid) {
            toast.error(`Invalid workflow: ${validation.errors.join(", ")}`);
            return;
          }
          setNodes(parseWorkflowNodes(graph.nodes) as Node[]);
          setEdges(parseWorkflowEdges(graph.edges));
          toast.success(`Imported ${graph.nodes.length} nodes`);
        }}
        onNameChange={setWorkflowName}
        onUndo={() => {
          if (historyIndex <= 0) return toast.error("Nothing to undo");
          setComparisonStates({
            previous: history[historyIndex - 1],
            current: history[historyIndex],
          });
          setShowHistoryComparison(true);
        }}
        onRedo={() => {
          if (historyIndex >= history.length - 1)
            return toast.error("Nothing to redo");
          setComparisonStates({
            previous: history[historyIndex],
            current: history[historyIndex + 1],
          });
          setShowHistoryComparison(true);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="relative flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange as OnNodesChange}
          onEdgesChange={onEdgesChange as OnEdgesChange}
          onConnect={handleConnect}
          onEdgeDoubleClick={(_: React.MouseEvent, edge: Edge) => {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            toast.success("Connection removed");
          }}
          onNodeClick={(_: React.MouseEvent, node: Node) => {
            setSelectedNode(node as WorkflowNode);
            setIsPanelOpen(true);
          }}
          onPaneClick={() => {
            setSelectedNode(null);
            setIsPanelOpen(false);
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{ type: "custom", animated: false }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#A7A7A7"
            style={{ backgroundColor: "#2E2E2E" }}
          />

          <TooltipProvider>
            <div className="absolute bottom-4 left-4 flex z-10 gap-3 p-3 rounded-lg shadow-lg">
              {[
                {
                  icon: ZoomIn,
                  onClick: () => reactFlowInstance.zoomIn(),
                  tooltip: "Zoom In",
                },
                {
                  icon: ZoomOut,
                  onClick: () => reactFlowInstance.zoomOut(),
                  tooltip: "Zoom Out",
                },
                {
                  icon: RefreshCw,
                  onClick: () => reactFlowInstance.fitView({ padding: 0.2 }),
                  tooltip: "Reset View",
                },
                {
                  icon: Crosshair,
                  onClick: () => reactFlowInstance.fitView({ duration: 800 }),
                  tooltip: "Center View",
                },
                {
                  icon: Layout,
                  onClick: () => {
                    /* auto-position logic */
                  },
                  tooltip: "Auto-Position",
                },
              ].map(({ icon: Icon, onClick, tooltip }, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white bg-primary"
                      onClick={onClick}
                    >
                      <Icon size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <MiniMap
            nodeStrokeWidth={3}
            className="absolute bottom-16 right-4 border border-primary"
            nodeColor={(node) =>
              (node as WorkflowNode).data?.errors?.length
                ? "#ef4444"
                : "#3b82f6"
            }
            style={{ backgroundColor: "#2E2E2E" }}
          />

          <Panel position="top-right" className="m-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setPendingEdge(null);
                setIsAddNodeOpen(true);
              }}
              className="border border-primary bg-[#2E2E2E] px-2 py-2 text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsAiGeneratorOpen(true)}
              className="border border-primary bg-[#2E2E2E] px-2 py-2 text-white"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          </Panel>

          {validationErrors.length > 0 && (
            <Panel position="bottom-left" className="m-4">
              <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-300">
                    Validation Issues ({validationErrors.length})
                  </span>
                </div>
                <ul className="list-inside list-disc space-y-1 text-xs text-red-300">
                  {validationErrors.slice(0, 3).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </Panel>
          )}

          {hasUnsavedChanges && (
            <Panel position="top-left" className="m-4">
              <div className="px-3 py-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Unsaved changes
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      <AddNodeSheet
        open={isAddNodeOpen}
        onOpenChange={setIsAddNodeOpen}
        onSelectNode={handleAddNode}
      />
      <AiWorkflowGeneratorSheet
        open={isAiGeneratorOpen}
        onOpenChange={setIsAiGeneratorOpen}
        onGenerate={generateAiWorkflow}
      />
      <NodeSettingsPanel
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setSelectedNode(null);
        }}
        onUpdate={handleNodeUpdate}
        onDelete={handleNodeDelete}
      />
      <HistoryComparisonDialog
        isOpen={showHistoryComparison}
        onClose={() => setShowHistoryComparison(false)}
        previousState={comparisonStates.previous}
        currentState={comparisonStates.current}
        onApply={(targetIndex) => {
          if (targetIndex < 0 || targetIndex >= history.length) return;
          setIsApplyingHistory(true);
          const targetState = history[targetIndex];
          setNodes(JSON.parse(JSON.stringify(targetState.nodes)));
          setEdges(JSON.parse(JSON.stringify(targetState.edges)));
          setHistoryIndex(targetIndex);
          setTimeout(() => setIsApplyingHistory(false), 100);
          toast.success(
            targetIndex < historyIndex ? "Undo applied" : "Redo applied"
          );
          setShowHistoryComparison(false);
        }}
        currentIndex={historyIndex}
      />
    </div>
  );
}

export function WorkflowEditor({ workflowId }: { workflowId: string }) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent workflowId={workflowId} />
    </ReactFlowProvider>
  );
}
