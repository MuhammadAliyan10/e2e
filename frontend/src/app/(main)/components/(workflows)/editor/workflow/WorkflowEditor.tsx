"use client";

import { useCallback, useState, useEffect, useRef } from "react";
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

import { Button } from "@/components/ui/button";
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
import { TriggerNode } from "../nodes/TriggerNode";
import { CustomEdge } from "../edges/CustomEdge";
import { WorkflowNavbar } from "./WorkflowNavbar";
import { AddNodeSheet } from "../AddNodeSheet";
import { AiWorkflowGeneratorSheet } from "./AiWorkflowGeneratorSheet";
import { NodeSettingsPanel } from "../NodeSettingsPanel";
import { OpenURLNode } from "../nodes/web-automation/OpenURLNode";

// Import all node components

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  openURL: OpenURLNode,
};

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
  custom: CustomEdge,
};

interface WorkflowEditorContentProps {
  workflowId: string;
}

function parseWorkflowNodes(nodes: any): Node[] {
  try {
    if (Array.isArray(nodes)) return nodes;
    if (typeof nodes === "string") {
      const parsed = JSON.parse(nodes);
      return Array.isArray(parsed) ? parsed : [];
    }
    console.error(
      "[WorkflowEditor] Nodes is not array or string:",
      typeof nodes
    );
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
    console.error(
      "[WorkflowEditor] Edges is not array or string:",
      typeof edges
    );
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
  console.log("[WorkflowEditor] Generating AI workflow:", config);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const generatedNodes: WorkflowNode[] = [];
  const generatedEdges: DataEdge[] = [];

  const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
  generatedNodes.push(triggerNode);

  let previousNode = triggerNode;
  let yOffset = 200;

  if (config.mode === "text" && config.prompt) {
    const aiAgentNode = createNodeSafe("aiAgent", { x: 100, y: yOffset });
    aiAgentNode.data = {
      ...aiAgentNode.data,
      url: config.targetUrl,
      prompt: config.prompt,
      model: "gpt-4",
      maxSteps: 10,
    };
    generatedNodes.push(aiAgentNode);

    generatedEdges.push({
      id: `e${previousNode.id}-${aiAgentNode.id}`,
      source: previousNode.id,
      target: aiAgentNode.id,
      type: "custom",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    });

    previousNode = aiAgentNode;
  }

  return { nodes: generatedNodes, edges: generatedEdges };
}

function WorkflowEditorContent({ workflowId }: WorkflowEditorContentProps) {
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

  const reactFlowInstance = useReactFlow();
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

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
  }, [workflow, setNodes, setEdges, hasInitialized]);

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

      saveWorkflow({
        nodes: nodes as WorkflowNode[],
        edges,
        variables: workflow?.variables || {},
        version: workflow?.version || 1,
      });
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    nodes,
    edges,
    saveWorkflow,
    workflow?.variables,
    workflow?.version,
    hasInitialized,
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
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: "custom",
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
        data: {
          isDashed: connection.sourceHandle?.startsWith("sub-"),
          label: connection.sourceHandle?.replace("sub-", ""),
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
        const position = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

        const newNode = createNodeSafe(nodeType, {
          position,
          validate: false,
        });

        setNodes((nds) => [...nds, newNode as Node]);

        setSelectedNode(newNode);
        setIsPanelOpen(true);
        setIsAddNodeOpen(false);

        toast.success(`${newNode.data.label} node added`);
      } catch (error) {
        toast.error("Failed to add node");
      }
    },
    [reactFlowInstance, setNodes]
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
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      await saveWorkflow({
        nodes: nodes as WorkflowNode[],
        edges,
        variables: workflow?.variables || {},
        version: workflow?.version || 1,
      });
      toast.success("Workflow saved");
    } catch (error) {
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
      a.download = `workflow-${workflowId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Workflow exported");
    } catch (error) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1419]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-white">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f1419]">
      <WorkflowNavbar
        workflowId={workflowId}
        workflowName={workflow?.name || "Untitled Workflow"}
        nodeCount={nodes.length}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSave={handleSave}
        onRun={handleRun}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="flex-1 relative overflow-hidden">
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
            markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#475569"
            style={{ backgroundColor: "#0f1419" }}
          />

          <Controls className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl" />

          <MiniMap
            className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl"
            nodeColor={(node) => {
              const workflowNode = node as WorkflowNode;
              return workflowNode.data?.errors?.length ? "#ef4444" : "#3b82f6";
            }}
            maskColor="rgba(15, 20, 25, 0.8)"
          />

          <Panel position="top-right" className="m-4 flex flex-col gap-2">
            <Button
              onClick={() => setIsAddNodeOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Node
            </Button>
            <Button
              onClick={() => setIsAiGeneratorOpen(true)}
              size="sm"
              variant="outline"
              className="border-purple-500 hover:bg-purple-600/20 text-white shadow-lg gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
          </Panel>

          {validationErrors.length > 0 && (
            <Panel position="bottom-left" className="m-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-300">
                    Validation Issues ({validationErrors.length})
                  </span>
                </div>
                <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
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
        onOpenChange={setIsAddNodeOpen}
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
