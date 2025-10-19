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

import { WorkflowNavbar } from "./WorkflowNavbar";
import { AddNodeSheet } from "./AddNodeSheet";
import { NodeSettingsPanel } from "./NodeSettingsPanel";
import { DataEdge as CustomEdge } from "./edges/DataEdge";
import { AiWorkflowGeneratorSheet } from "./AiWorkflowGeneratorSheet";

// Import all node components
import { NavigateNode, ClickNode, ExtractNode } from "./nodes";
import { TriggerNode } from "./nodes/TriggerNode";
import { AIAgentNode } from "./nodes/AIAgentNode";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  aiAgent: AIAgentNode,
  navigate: NavigateNode,
  click: ClickNode,
  extract: ExtractNode,
  // screenshot: ScreenshotNode,
  // scroll: ScrollNode,
  // hover: HoverNode,
  // select: SelectNode,
  // uploadFile: UploadFileNode,
  // condition: ConditionNode,
  // loop: LoopNode,
  // switch: SwitchNode,
  // merge: MergeNode,
  // transform: TransformNode,
  // filter: FilterNode,
  // setVariable: SetVariableNode,
};

const edgeTypes: EdgeTypes = {
  data: CustomEdge,
};

interface WorkflowEditorContentProps {
  workflowId: string;
}

/**
 * Safely parse workflow nodes from various formats
 */
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

/**
 * Safely parse workflow edges from various formats
 */
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

/**
 * Generate workflow from AI config
 */
async function generateAiWorkflow(config: AiWorkflowConfig): Promise<{
  nodes: WorkflowNode[];
  edges: DataEdge[];
}> {
  console.log("[WorkflowEditor] Generating AI workflow:", config);

  // Simulate AI generation (replace with actual API call)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const generatedNodes: WorkflowNode[] = [];
  const generatedEdges: DataEdge[] = [];

  // Create trigger node
  const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
  generatedNodes.push(triggerNode);

  let previousNode = triggerNode;
  let yOffset = 200;

  if (config.mode === "text" && config.prompt) {
    // Simple mode: Create AI Agent node
    const aiAgentNode = createNodeSafe("aiAgent", { x: 100, y: yOffset });
    aiAgentNode.data = {
      ...aiAgentNode.data,
      url: config.targetUrl,
      prompt: config.prompt,
      model: "gpt-4",
      maxSteps: 10,
    };
    generatedNodes.push(aiAgentNode);

    // Connect trigger to AI agent
    generatedEdges.push({
      id: `e${previousNode.id}-${aiAgentNode.id}`,
      source: previousNode.id,
      target: aiAgentNode.id,
      type: "data",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
    });

    previousNode = aiAgentNode;
    yOffset += 150;
  } else if (config.mode === "steps" && config.steps) {
    // Step-by-step mode: Create nodes for each step
    for (const [index, step] of config.steps.entries()) {
      // Determine node type based on prompt keywords
      let nodeType: NodeType = "click";
      if (
        step.prompt.toLowerCase().includes("navigate") ||
        step.prompt.toLowerCase().includes("go to")
      ) {
        nodeType = "navigate";
      } else if (
        step.prompt.toLowerCase().includes("extract") ||
        step.prompt.toLowerCase().includes("scrape")
      ) {
        nodeType = "extract";
      } else if (
        step.prompt.toLowerCase().includes("screenshot") ||
        step.prompt.toLowerCase().includes("capture")
      ) {
        nodeType = "screenshot";
      } else if (
        step.prompt.toLowerCase().includes("scroll") ||
        step.prompt.toLowerCase().includes("page down")
      ) {
        nodeType = "scroll";
      }

      const newNode = createNodeSafe(nodeType, { x: 100, y: yOffset });
      newNode.data = {
        ...newNode.data,
        label: `Step ${index + 1}: ${nodeType}`,
      };

      // Add step-specific data
      if (nodeType === "navigate" && index === 0) {
        (newNode.data as any).url = config.targetUrl;
      }

      generatedNodes.push(newNode);

      // Connect to previous node
      generatedEdges.push({
        id: `e${previousNode.id}-${newNode.id}`,
        source: previousNode.id,
        target: newNode.id,
        type: "data",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
      });

      previousNode = newNode;
      yOffset += 150;
    }
  }

  console.log("[WorkflowEditor] Generated workflow:", {
    nodeCount: generatedNodes.length,
    edgeCount: generatedEdges.length,
  });

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

  // Load workflow data with comprehensive error handling
  useEffect(() => {
    if (hasInitialized) return;

    try {
      if (workflow?.nodes && workflow?.edges) {
        console.log("[WorkflowEditor] Loading workflow data:", {
          workflowId,
          nodesType: typeof workflow.nodes,
          edgesType: typeof workflow.edges,
        });

        const loadedNodes = parseWorkflowNodes(workflow.nodes);
        const loadedEdges = parseWorkflowEdges(workflow.edges);

        console.log("[WorkflowEditor] Parsed data:", {
          nodeCount: loadedNodes.length,
          edgeCount: loadedEdges.length,
        });

        // Filter invalid node types
        const validNodes = loadedNodes.filter((node: any) => {
          if (!node || typeof node !== "object") {
            console.error("[WorkflowEditor] Invalid node object:", node);
            return false;
          }

          if (!node.type || !isValidNodeType(node.type)) {
            console.error(
              `[WorkflowEditor] Invalid node type: "${node.type}" (id: ${node.id})`
            );
            toast.error(`Removed unsupported node: ${node.type}`);
            return false;
          }

          return true;
        });

        // Ensure trigger node exists
        const hasTrigger = validNodes.some((n: any) => n.type === "trigger");
        if (!hasTrigger) {
          console.log("[WorkflowEditor] Adding default trigger node");
          try {
            const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
            setNodes([triggerNode as Node, ...validNodes]);
            toast.info("Added trigger node to workflow");
          } catch (error) {
            console.error("[WorkflowEditor] Failed to create trigger:", error);
            toast.error("Failed to initialize trigger node");
            setNodes(validNodes);
          }
        } else {
          setNodes(validNodes);
        }

        setEdges(loadedEdges);
        setHasInitialized(true);

        if (validNodes.length > 0) {
          toast.success(
            `Loaded ${validNodes.length} nodes and ${loadedEdges.length} connections`
          );
        }
      } else {
        // Initialize new workflow with trigger
        console.log("[WorkflowEditor] Initializing new workflow");
        try {
          const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
          setNodes([triggerNode as Node]);
          setHasInitialized(true);
          toast.success("Workflow initialized");
        } catch (error) {
          console.error("[WorkflowEditor] Failed to initialize:", error);
          toast.error("Failed to create workflow");
        }
      }
    } catch (error) {
      console.error("[WorkflowEditor] Critical error loading workflow:", error);
      toast.error("Failed to load workflow. Creating empty workflow.");

      // Fallback
      try {
        const triggerNode = createNodeSafe("trigger", { x: 100, y: 100 });
        setNodes([triggerNode as Node]);
        setHasInitialized(true);
      } catch (fallbackError) {
        console.error("[WorkflowEditor] Fallback failed:", fallbackError);
        toast.error("Critical error: Unable to initialize editor");
      }
    }
  }, [workflow, setNodes, setEdges, hasInitialized, workflowId]);

  // Auto-save with debounce (3s)
  useEffect(() => {
    if (nodes.length === 0 || !hasInitialized) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const validation = validateWorkflowGraph(nodes as WorkflowNode[], edges);

      if (!validation.valid) {
        console.warn(
          "[WorkflowEditor] Validation warnings:",
          validation.errors
        );
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

  // Handle new connections
  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) {
        console.error("[WorkflowEditor] Invalid connection nodes");
        return;
      }

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
        type: "data",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#64748b",
        },
        data: {
          payload: null,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      console.log("[WorkflowEditor] Connected nodes:", connection);
    },
    [nodes, setEdges]
  );

  // Handle node click
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    console.log("[WorkflowEditor] Node clicked:", node.id);
    setSelectedNode(node as WorkflowNode);
    setIsPanelOpen(true);
  }, []);

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsPanelOpen(false);
  }, []);

  // Add new node
  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      try {
        const position = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

        const newNode = createNodeSafe(nodeType, position);
        setNodes((nds) => [...nds, newNode as Node]);

        // Open settings panel
        setSelectedNode(newNode);
        setIsPanelOpen(true);
        setIsAddNodeOpen(false);

        console.log("[WorkflowEditor] Added node:", nodeType, newNode.id);
        toast.success(`${newNode.data.label} node added`);
      } catch (error) {
        console.error("[WorkflowEditor] Failed to add node:", error);
        toast.error("Failed to add node. Please try again.");
      }
    },
    [reactFlowInstance, setNodes]
  );

  // Update node data
  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      console.log("[WorkflowEditor] Updated node:", nodeId, data);
    },
    [setNodes]
  );

  // Delete node
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

      console.log("[WorkflowEditor] Deleted node:", nodeId);
      toast.success("Node deleted");
    },
    [nodes, setNodes, setEdges]
  );

  // AI Workflow Generation
  const handleAiGenerate = async (config: AiWorkflowConfig) => {
    try {
      const { nodes: generatedNodes, edges: generatedEdges } =
        await generateAiWorkflow(config);

      // Replace workflow with generated nodes
      setNodes(generatedNodes as Node[]);
      setEdges(generatedEdges);

      console.log("[WorkflowEditor] AI workflow loaded:", {
        nodes: generatedNodes.length,
        edges: generatedEdges.length,
      });

      // Fit view to new nodes
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);

      toast.success(`Generated workflow with ${generatedNodes.length} nodes`);
    } catch (error: any) {
      console.error("[WorkflowEditor] AI generation failed:", error);
      throw error;
    }
  };

  // Manual save
  const handleSave = async () => {
    try {
      await saveWorkflow({
        nodes: nodes as WorkflowNode[],
        edges,
        variables: workflow?.variables || {},
        version: workflow?.version || 1,
      });
      console.log("[WorkflowEditor] Manual save completed");
      toast.success("Workflow saved");
    } catch (error) {
      console.error("[WorkflowEditor] Save failed:", error);
      toast.error("Failed to save workflow");
    }
  };

  // Export workflow as JSON
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

      console.log("[WorkflowEditor] Exported workflow:", workflowId);
      toast.success("Workflow exported");
    } catch (error) {
      console.error("[WorkflowEditor] Export failed:", error);
      toast.error("Failed to export workflow");
    }
  };

  // Import workflow from JSON
  const handleImport = (graph: WorkflowGraph) => {
    try {
      const importedNodes = parseWorkflowNodes(graph.nodes);
      const importedEdges = parseWorkflowEdges(graph.edges);

      const validNodes = importedNodes.filter((node: any) => {
        if (!node || !isValidNodeType(node.type)) {
          console.warn(`[WorkflowEditor] Skipping invalid node: ${node?.type}`);
          return false;
        }
        return true;
      });

      if (validNodes.length === 0) {
        throw new Error("No valid nodes in imported workflow");
      }

      setNodes(validNodes as Node[]);
      setEdges(importedEdges);

      console.log("[WorkflowEditor] Imported workflow:", {
        nodes: validNodes.length,
        edges: importedEdges.length,
      });
      toast.success(`Imported ${validNodes.length} nodes`);
    } catch (error) {
      console.error("[WorkflowEditor] Import failed:", error);
      toast.error("Failed to import workflow");
    }
  };

  // Run workflow
  const handleRun = () => {
    const validation = validateWorkflowGraph(nodes as WorkflowNode[], edges);

    if (!validation.valid) {
      toast.error("Workflow has validation errors");
      console.error("[WorkflowEditor] Validation errors:", validation.errors);
      setValidationErrors(validation.errors);
      return;
    }

    console.log("[WorkflowEditor] Executing workflow:", workflowId);
    toast.info("Execution started (backend integration pending)");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1419]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-white">Loading workflow...</p>
          <p className="text-xs text-slate-400">Initializing canvas</p>
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
            animated: true,
            style: { strokeWidth: 2, stroke: "#64748b" },
          }}
          proOptions={{ hideAttribution: true }}
        >
          {/* Fixed Background with visible dots */}
          <Background
            id="workflow-background"
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#475569"
            style={{
              backgroundColor: "#0f1419",
              opacity: 1,
            }}
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

          {/* Action Buttons Panel */}
          <Panel position="top-right" className="m-4 flex flex-col gap-2">
            <Button
              onClick={() => setIsAddNodeOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-none gap-2 w-full justify-start"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button
              onClick={() => setIsAiGeneratorOpen(true)}
              size="sm"
              variant="outline"
              className="bg-primary border-primary hover:bg-purple-600/20 text-white rounded-none shadow-lg gap-2 w-full justify-start"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </Panel>

          {/* Validation Errors Panel */}
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
                  {validationErrors.length > 3 && (
                    <li className="text-red-400">
                      +{validationErrors.length - 3} more issues
                    </li>
                  )}
                </ul>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Add Node Sheet */}
      <AddNodeSheet
        open={isAddNodeOpen}
        onOpenChange={setIsAddNodeOpen}
        onSelectNode={handleAddNode}
      />

      {/* AI Workflow Generator Dialog */}

      <AiWorkflowGeneratorSheet
        open={isAiGeneratorOpen}
        onOpenChange={setIsAiGeneratorOpen}
        onGenerate={handleAiGenerate}
      />

      {/* Node Settings Panel */}
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

/**
 * Main WorkflowEditor component with ReactFlowProvider wrapper
 */
export function WorkflowEditor({ workflowId }: { workflowId: string }) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent workflowId={workflowId} />
    </ReactFlowProvider>
  );
}
