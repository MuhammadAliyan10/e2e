"use client";

import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
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

import { Plus, AlertCircle, Sparkles } from "lucide-react";
import { useWorkflowEditor } from "@/lib/hooks/use-workflow-editor";
import {
  createNodeSafe,
  validateNodeConnection,
  validateWorkflowGraph,
} from "@/lib/utils/node-factory";
import { isValidNodeType } from "@/lib/utils/node-registry";
import type {
  NodeType,
  WorkflowNode,
  DataEdge,
  WorkflowGraph,
} from "@/lib/types/workflow-nodes.types";
import { toast } from "sonner";
import { DataEdge as DataEdgeComponent } from "../edges/DataEdge";
import { AddNodeSheet } from "../AddNodeSheet";
import { AiWorkflowGeneratorSheet } from "./AiWorkflowGeneratorSheet";
import { NodeSettingsPanel } from "../NodeSettingsPanel";

import { isTemporaryWorkflowId } from "@/lib/utils/workflow-id";
import { useRouter } from "next/navigation";
import { WorkflowNavbar } from "./WorkflowNavbar";
import OnClickTriggerNode from "../nodes/trigger/OnClickTriggerNode";

const nodeTypes: NodeTypes = {
  trigger: OnClickTriggerNode,
};

const edgeTypes: EdgeTypes = {
  default: DataEdgeComponent,
  custom: DataEdgeComponent,
};

interface WorkflowEditorContentProps {
  workflowId: string;
}

interface PendingEdge {
  sourceNodeId: string;
  sourceHandleId: string;
  sourceX: number;
  sourceY: number;
}

function parseWorkflowNodes(nodes: any): Node[] {
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

function parseWorkflowEdges(edges: any): DataEdge[] {
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

async function generateAiWorkflow(config: any): Promise<{
  nodes: WorkflowNode[];
  edges: DataEdge[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const generatedNodes: WorkflowNode[] = [];
  const generatedEdges: DataEdge[] = [];
  const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
  generatedNodes.push(triggerNode);
  return { nodes: generatedNodes, edges: generatedEdges };
}

function WorkflowEditorContent({ workflowId }: WorkflowEditorContentProps) {
  const router = useRouter();
  const { workflow, isLoading, saveWorkflow, isSaving, lastSaved } =
    useWorkflowEditor(workflowId);

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

  const reactFlowInstance = useReactFlow();
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // Stable callback - memoized to prevent re-renders
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

  // Only inject callback when nodes actually change IDs (not on every render)
  const nodeIds = useMemo(() => nodes.map((n) => n.id).join(","), [nodes]);

  useEffect(() => {
    // Only update if callback is not already injected
    const needsUpdate = nodes.some((node) => !node.data.onAddNode);

    if (!needsUpdate) return;

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddNode: handleNodeAddClick,
        },
      }))
    );
  }, [nodeIds, handleNodeAddClick]); // Depend on nodeIds string, not nodes array

  // Initialize workflow
  useEffect(() => {
    if (hasInitialized) return;

    try {
      if (workflow?.nodes && workflow?.edges) {
        const loadedNodes = parseWorkflowNodes(workflow.nodes);
        const loadedEdges = parseWorkflowEdges(workflow.edges);

        const validNodes = loadedNodes.filter((node: any) => {
          if (!node || typeof node !== "object") return false;
          if (!node.type || !isValidNodeType(node.type)) {
            toast.error(`Removed unsupported node: ${node.type}`);
            return false;
          }
          return true;
        });

        const hasTrigger = validNodes.some((n: any) => n.type === "trigger");
        if (!hasTrigger) {
          const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
          setNodes([triggerNode as Node, ...validNodes]);
        } else {
          setNodes(validNodes);
        }

        setEdges(loadedEdges);
        setWorkflowName(workflow.name || "Untitled Workflow");
        setHasInitialized(true);
      } else {
        const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
        setNodes([triggerNode as Node]);
        setHasInitialized(true);
      }
    } catch (error) {
      console.error("[WorkflowEditor] Critical error loading workflow:", error);
      const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
      setNodes([triggerNode as Node]);
      setHasInitialized(true);
    }
  }, [
    workflow?.nodes,
    workflow?.edges,
    workflow?.name,
    hasInitialized,
    setNodes,
    setEdges,
  ]);

  // Auto-save with debounce
  useEffect(() => {
    if (nodes.length === 0 || !hasInitialized) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const validation = validateWorkflowGraph(nodes as WorkflowNode[], edges);

      if (!validation.valid) {
        setValidationErrors(validation.errors);
      } else {
        setValidationErrors([]);
      }

      handleAutoSave();
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [nodes.length, edges.length, hasInitialized]); // Only trigger on count changes

  const handleAutoSave = useCallback(async () => {
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
    } catch (error) {
      console.error("[WorkflowEditor] Auto-save failed:", error);
    }
  }, [
    nodes,
    edges,
    workflow?.variables,
    workflow?.version,
    currentWorkflowId,
    saveWorkflow,
    router,
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
        toast.error(validation.error || "Invalid connection");
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
        data: {
          label: connection.sourceHandle || undefined,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      toast.success("Connection created");
    },
    [nodes, setEdges]
  );

  const handleEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      toast.success("Connection removed");
    },
    [setEdges]
  );

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as WorkflowNode);
    setIsPanelOpen(true);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsPanelOpen(false);
  }, []);

  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      try {
        let position: { x: number; y: number };

        if (pendingEdge) {
          position = {
            x: pendingEdge.sourceX + 250,
            y: pendingEdge.sourceY,
          };
        } else {
          position = reactFlowInstance.screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
        }

        const newNode = createNodeSafe(nodeType, {
          position,
          validate: false,
        });

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

        toast.success(`${newNode.data.label} node added`);
      } catch (error) {
        console.error("[WorkflowEditor] Failed to add node:", error);
        toast.error("Failed to add node");
      }
    },
    [reactFlowInstance, setNodes, setEdges, pendingEdge]
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
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

  const handleAiGenerate = async (config: any) => {
    try {
      const { nodes: generatedNodes, edges: generatedEdges } =
        await generateAiWorkflow(config);

      setNodes(generatedNodes as Node[]);
      setEdges(generatedEdges);

      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);

      toast.success(`Generated workflow with ${generatedNodes.length} nodes`);
    } catch (error: any) {
      console.error("[WorkflowEditor] AI generation failed:", error);
      toast.error("Failed to generate workflow");
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveWorkflow(
        {
          nodes: nodes as WorkflowNode[],
          edges,
          variables: workflow?.variables || {},
          version: workflow?.version || 1,
        },
        {
          name: workflowName,
        }
      );

      if (
        result?.isNew &&
        result?.id &&
        isTemporaryWorkflowId(currentWorkflowId)
      ) {
        setCurrentWorkflowId(result.id);
        router.replace(`/workflows/${result.id}`);
      }

      toast.success("Workflow saved");
    } catch (error) {
      console.error("[WorkflowEditor] Save failed:", error);
      toast.error("Failed to save workflow");
    }
  };

  const handleExport = () => {
    try {
      const graph: WorkflowGraph = {
        nodes: nodes as WorkflowNode[],
        edges,
        variables: workflow?.variables || {},
        version: workflow?.version || 1,
      };

      const blob = new Blob([JSON.stringify(graph, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workflow-${workflowName.replace(
        /\s+/g,
        "-"
      )}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Workflow exported");
    } catch (error) {
      console.error("[WorkflowEditor] Export failed:", error);
      toast.error("Failed to export workflow");
    }
  };

  const handleImport = (graph: WorkflowGraph) => {
    try {
      const importedNodes = parseWorkflowNodes(graph.nodes);
      const importedEdges = parseWorkflowEdges(graph.edges);

      const validNodes = importedNodes.filter((node: any) => {
        if (!node || !isValidNodeType(node.type)) return false;
        return true;
      });

      setNodes(validNodes as Node[]);
      setEdges(importedEdges);
      toast.success(`Imported ${validNodes.length} nodes`);
    } catch (error) {
      console.error("[WorkflowEditor] Import failed:", error);
      toast.error("Failed to import workflow");
    }
  };

  const handleRun = () => {
    const validation = validateWorkflowGraph(nodes as WorkflowNode[], edges);

    if (!validation.valid) {
      toast.error("Workflow has validation errors");
      setValidationErrors(validation.errors);
      return;
    }

    toast.info("Execution started");
  };

  const handleNameChange = (newName: string) => {
    setWorkflowName(newName);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#2E2E2E]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
        onSave={handleSave}
        onRun={handleRun}
        onExport={handleExport}
        onImport={handleImport}
        onNameChange={handleNameChange}
      />

      <div className="relative flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange as OnNodesChange}
          onEdgesChange={onEdgesChange as OnEdgesChange}
          onConnect={handleConnect}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
          }}
          defaultEdgeOptions={{
            type: "custom",
            animated: false,
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#A7A7A7"
            style={{ backgroundColor: "#2E2E2E" }}
          />

          <Controls className="rounded-lg border border-slate-700 bg-slate-800/90 shadow-2xl backdrop-blur-sm" />

          <MiniMap
            className="rounded-lg border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-sm"
            nodeColor={(node) => {
              const workflowNode = node as WorkflowNode;
              return workflowNode.data?.errors?.length ? "#ef4444" : "#3b82f6";
            }}
            maskColor="rgba(15, 20, 25, 0.8)"
          />

          <Panel position="top-right" className="m-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setPendingEdge(null);
                setIsAddNodeOpen(true);
              }}
              className="border border-[#3a3a3a] bg-[#2E2E2E] px-2 py-2 text-white transition-colors hover:border-primary hover:text-primary"
              type="button"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsAiGeneratorOpen(true)}
              className="border border-[#3a3a3a] bg-[#2E2E2E] px-2 py-2 text-white transition-colors hover:border-primary hover:text-primary"
              type="button"
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
        </ReactFlow>
      </div>

      <AddNodeSheet
        open={isAddNodeOpen}
        onOpenChange={(open) => {
          setIsAddNodeOpen(open);
          if (!open) setPendingEdge(null);
        }}
        onSelectNode={handleAddNode}
      />

      <AiWorkflowGeneratorSheet
        open={isAiGeneratorOpen}
        onOpenChange={setIsAiGeneratorOpen}
        onGenerate={handleAiGenerate}
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
