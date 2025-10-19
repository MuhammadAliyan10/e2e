import type {
  NodeType,
  WorkflowNodeData,
} from "@/lib/types/workflow-nodes.types";

export interface NodeDefinition {
  type: NodeType;
  label: string;
  category: "trigger" | "browser" | "logic" | "data" | "integration" | "ai";
  icon: string;
  color: string;
  description: string;
  defaultData: WorkflowNodeData;
  outputSchema?: Record<string, any>;
}

export const NODE_REGISTRY: Record<NodeType, NodeDefinition> = {
  // ============ TRIGGER ============
  trigger: {
    type: "trigger",
    label: "Trigger",
    category: "trigger",
    icon: "Play",
    color: "#22c55e",
    description: "Start workflow execution",
    defaultData: {
      label: "Trigger",
      type: "manual",
      enabled: true,
    } as any,
    outputSchema: {
      trigger: "object",
      timestamp: "string",
      source: "string",
      payload: "object",
    },
  },

  // ============ AI AGENT ============
  aiAgent: {
    type: "aiAgent",
    label: "AI Agent",
    category: "ai",
    icon: "Sparkles",
    color: "#a855f7",
    description: "AI automates browser tasks from natural language prompts",
    defaultData: {
      label: "AI Agent",
      url: "",
      prompt: "",
      model: "gpt-4",
      maxSteps: 10,
      outputFormat: "structured",
    } as any,
    outputSchema: {
      success: "boolean",
      steps: "array",
      result: "object",
      screenshots: "array",
    },
  },

  // ============ BROWSER NODES ============
  navigate: {
    type: "navigate",
    label: "Navigate",
    category: "browser",
    icon: "Navigation",
    color: "#3b82f6",
    description: "Navigate to a URL",
    defaultData: {
      label: "Navigate to URL",
      url: "",
      timeout: 30000,
    } as any,
    outputSchema: {
      url: "string",
      title: "string",
    },
  },

  click: {
    type: "click",
    label: "Click",
    category: "browser",
    icon: "MousePointer",
    color: "#8b5cf6",
    description: "Click an element",
    defaultData: {
      label: "Click",
      selector: "",
      clickType: "single",
    } as any,
    outputSchema: {
      clicked: "boolean",
    },
  },

  type: {
    type: "type",
    label: "Type",
    category: "browser",
    icon: "Keyboard",
    color: "#6366f1",
    description: "Type text into input",
    defaultData: {
      label: "Type Text",
      selector: "",
      text: "",
      pressEnter: false,
    } as any,
    outputSchema: {
      typed: "string",
    },
  },

  extract: {
    type: "extract",
    label: "Extract",
    category: "browser",
    icon: "Download",
    color: "#f59e0b",
    description: "Extract data from page",
    defaultData: {
      label: "Extract Data",
      extractions: [],
    } as any,
    outputSchema: {
      extracted: "object",
    },
  },

  screenshot: {
    type: "screenshot",
    label: "Screenshot",
    category: "browser",
    icon: "Camera",
    color: "#06b6d4",
    description: "Capture screenshot",
    defaultData: {
      label: "Take Screenshot",
      fullPage: false,
      format: "png",
    } as any,
    outputSchema: {
      screenshot: "string",
      url: "string",
    },
  },

  scroll: {
    type: "scroll",
    label: "Scroll",
    category: "browser",
    icon: "ArrowDown",
    color: "#14b8a6",
    description: "Scroll page",
    defaultData: {
      label: "Scroll",
      direction: "down",
      distance: 500,
    } as any,
    outputSchema: {
      scrolled: "boolean",
    },
  },

  hover: {
    type: "hover",
    label: "Hover",
    category: "browser",
    icon: "MousePointer2",
    color: "#84cc16",
    description: "Hover over element",
    defaultData: {
      label: "Hover",
      selector: "",
      duration: 500,
    } as any,
    outputSchema: {
      hovered: "boolean",
    },
  },

  select: {
    type: "select",
    label: "Select",
    category: "browser",
    icon: "ChevronDown",
    color: "#eab308",
    description: "Select dropdown option",
    defaultData: {
      label: "Select Option",
      selector: "",
      value: "",
    } as any,
    outputSchema: {
      selected: "string",
    },
  },

  uploadFile: {
    type: "uploadFile",
    label: "Upload",
    category: "browser",
    icon: "Upload",
    color: "#f97316",
    description: "Upload file",
    defaultData: {
      label: "Upload File",
      selector: "",
      filePath: "",
    } as any,
    outputSchema: {
      uploaded: "boolean",
    },
  },

  // ============ LOGIC NODES ============
  condition: {
    type: "condition",
    label: "If",
    category: "logic",
    icon: "GitBranch",
    color: "#ec4899",
    description: "Branch on condition",
    defaultData: {
      label: "If Condition",
      conditions: [],
      logic: "AND",
    } as any,
    outputSchema: {
      matched: "boolean",
    },
  },

  loop: {
    type: "loop",
    label: "Loop",
    category: "logic",
    icon: "Repeat",
    color: "#f43f5e",
    description: "Iterate over items",
    defaultData: {
      label: "Loop",
      items: "",
      maxIterations: 100,
    } as any,
    outputSchema: {
      items: "array",
      count: "number",
    },
  },

  switch: {
    type: "switch",
    label: "Switch",
    category: "logic",
    icon: "LayoutGrid",
    color: "#d946ef",
    description: "Route by value",
    defaultData: {
      label: "Switch",
      inputField: "",
      cases: [],
    } as any,
    outputSchema: {
      matched: "string",
    },
  },

  merge: {
    type: "merge",
    label: "Merge",
    category: "logic",
    icon: "Merge",
    color: "#c026d3",
    description: "Combine inputs",
    defaultData: {
      label: "Merge",
      mode: "append",
    } as any,
    outputSchema: {
      merged: "array",
    },
  },

  // ============ DATA NODES ============
  transform: {
    type: "transform",
    label: "Transform",
    category: "data",
    icon: "Wand2",
    color: "#0ea5e9",
    description: "Transform data",
    defaultData: {
      label: "Transform",
      transformations: [],
    } as any,
    outputSchema: {
      output: "object",
    },
  },

  filter: {
    type: "filter",
    label: "Filter",
    category: "data",
    icon: "Filter",
    color: "#0891b2",
    description: "Filter array",
    defaultData: {
      label: "Filter",
      conditions: [],
    } as any,
    outputSchema: {
      filtered: "array",
    },
  },

  setVariable: {
    type: "setVariable",
    label: "Set Variable",
    category: "data",
    icon: "Variable",
    color: "#8b5cf6",
    description: "Set workflow variable",
    defaultData: {
      label: "Set Variable",
      variables: [],
    } as any,
    outputSchema: {
      variables: "object",
    },
  },

  // ============ INTEGRATION NODES ============
  httpRequest: {
    type: "httpRequest",
    label: "HTTP",
    category: "integration",
    icon: "Globe",
    color: "#10b981",
    description: "Make API request",
    defaultData: {
      label: "HTTP Request",
      method: "GET",
      url: "",
      headers: {},
    } as any,
    outputSchema: {
      status: "number",
      data: "object",
      headers: "object",
    },
  },

  webhook: {
    type: "webhook",
    label: "Webhook",
    category: "integration",
    icon: "Webhook",
    color: "#059669",
    description: "Receive webhook",
    defaultData: {
      label: "Webhook",
      method: "POST",
      path: "",
      responseMode: "lastNode",
    } as any,
    outputSchema: {
      body: "object",
      headers: "object",
      query: "object",
    },
  },
};

/**
 * Get node definition by type with error handling
 * @throws Error if node type not found
 */
export function getNodeDefinition(type: NodeType): NodeDefinition {
  const definition = NODE_REGISTRY[type];

  if (!definition) {
    const availableTypes = Object.keys(NODE_REGISTRY).join(", ");
    console.error(
      `Node type "${type}" not found. Available types: ${availableTypes}`
    );
    throw new Error(
      `Node definition not found for type: "${type}". Available types: ${availableTypes}`
    );
  }

  return definition;
}

/**
 * Get nodes by category
 */
export function getNodesByCategory(
  category: NodeDefinition["category"]
): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter(
    (node) => node.category === category
  );
}

/**
 * Check if node type exists in registry
 */
export function isValidNodeType(type: string): type is NodeType {
  return type in NODE_REGISTRY;
}

/**
 * Get all registered node types
 */
export function getAllNodeTypes(): NodeType[] {
  return Object.keys(NODE_REGISTRY) as NodeType[];
}

/**
 * Get fallback node definition for error recovery
 */
export function getFallbackNode(): NodeDefinition {
  return NODE_REGISTRY.trigger;
}
