// src/lib/types/workflow-nodes-definitions.ts
import type {
  NodeType,
  WorkflowNodeData,
} from "@/lib/types/workflow-nodes.types";

export const EDGE_COLOR = "#C3C9D5";

export type NodeCategory = "Event-Based" | "Web Automation";

export interface NodeOutputSchema {
  [key: string]: string;
}

export interface NodeDefinition {
  type: NodeType;
  label: string;
  category: NodeCategory;
  icon: string;
  color: string;
  description: string;
  defaultData: Partial<WorkflowNodeData>;
  outputSchema?: NodeOutputSchema;
  tags?: string[];
}

export const NODE_REGISTRY: Record<NodeType, NodeDefinition> = {
  trigger: {
    type: "trigger",
    label: "Trigger",
    category: "Event-Based",
    icon: "MousePointerClick",
    color: EDGE_COLOR,
    description: "Start workflow execution manually",
    defaultData: {
      label: "Trigger",
      enabled: true,
      type: "manual",
    },
    outputSchema: {
      timestamp: "string",
      executionId: "string",
    },
  },

  openURL: {
    type: "openURL",
    label: "Open URL",
    category: "Web Automation",
    icon: "ExternalLink",
    color: EDGE_COLOR,
    description: "Navigate to a URL and wait for page load",
    defaultData: {
      label: "Open URL",
      enabled: true,
      url: "",
      waitForNavigation: true,
      timeout: 30000,
    },
    outputSchema: { url: "string", title: "string" },
  },

  clickElement: {
    type: "clickElement",
    label: "Click Element",
    category: "Web Automation",
    icon: "MousePointer",
    color: EDGE_COLOR,
    description: "Click on page elements using CSS/XPath selectors",
    defaultData: {
      label: "Click Element",
      enabled: true,
      selector: "",
      selectorType: "css",
      clickType: "single",
      waitForElement: true,
      waitTimeout: 10000,
    },
    outputSchema: { clicked: "boolean", selector: "string" },
  },

  fillInput: {
    type: "fillInput",
    label: "Fill Input",
    category: "Web Automation",
    icon: "Keyboard",
    color: EDGE_COLOR,
    description: "Type text into input fields or textareas",
    defaultData: {
      label: "Fill Input",
      enabled: true,
      selector: "",
      value: "",
      clearFirst: true,
    },
    outputSchema: { typed: "string" },
  },

  selectDropdown: {
    type: "selectDropdown",
    label: "Select Dropdown",
    category: "Web Automation",
    icon: "ChevronDown",
    color: EDGE_COLOR,
    description: "Select option from dropdown menus",
    defaultData: {
      label: "Select Dropdown",
      enabled: true,
      selector: "",
      value: "",
      selectBy: "value",
    },
    outputSchema: { selected: "string" },
  },

  uploadFile: {
    type: "uploadFile",
    label: "Upload File",
    category: "Web Automation",
    icon: "Upload",
    color: EDGE_COLOR,
    description: "Upload files to file input elements",
    defaultData: {
      label: "Upload File",
      enabled: true,
      selector: "",
      filePath: "",
      fileSource: "local",
    },
    outputSchema: { uploaded: "boolean" },
  },

  downloadFile: {
    type: "downloadFile",
    label: "Download File",
    category: "Web Automation",
    icon: "Download",
    color: EDGE_COLOR,
    description: "Download files from links or buttons",
    defaultData: {
      label: "Download File",
      enabled: true,
      savePath: "./downloads",
    },
    outputSchema: { downloaded: "boolean", path: "string" },
  },

  waitForElement: {
    type: "waitForElement",
    label: "Wait For Element",
    category: "Web Automation",
    icon: "Clock",
    color: EDGE_COLOR,
    description: "Wait until element appears or changes state",
    defaultData: {
      label: "Wait For Element",
      enabled: true,
      selector: "",
      state: "visible",
      timeout: 10000,
    },
    outputSchema: { found: "boolean" },
  },

  extractText: {
    type: "extractText",
    label: "Extract Text",
    category: "Web Automation",
    icon: "FileText",
    color: EDGE_COLOR,
    description: "Extract text content from page elements",
    defaultData: {
      label: "Extract Text",
      enabled: true,
      selector: "",
      attribute: "text",
      multiple: false,
    },
    outputSchema: { text: "string" },
  },

  extractAttribute: {
    type: "extractAttribute",
    label: "Extract Attribute",
    category: "Web Automation",
    icon: "Tag",
    color: EDGE_COLOR,
    description: "Extract HTML attributes (href, src, class, etc.)",
    defaultData: {
      label: "Extract Attribute",
      enabled: true,
      selector: "",
      attribute: "href",
    },
    outputSchema: { value: "string" },
  },

  takeScreenshot: {
    type: "takeScreenshot",
    label: "Take Screenshot",
    category: "Web Automation",
    icon: "Camera",
    color: EDGE_COLOR,
    description: "Capture full page or element screenshots",
    defaultData: {
      label: "Take Screenshot",
      enabled: true,
      fullPage: false,
      format: "png",
    },
    outputSchema: { screenshot: "string", url: "string" },
  },

  scrollToElement: {
    type: "scrollToElement",
    label: "Scroll To Element",
    category: "Web Automation",
    icon: "ArrowDown",
    color: EDGE_COLOR,
    description: "Scroll page to bring element into view",
    defaultData: {
      label: "Scroll To Element",
      enabled: true,
      behavior: "smooth",
    },
    outputSchema: { scrolled: "boolean" },
  },

  goBack: {
    type: "goBack",
    label: "Go Back",
    category: "Web Automation",
    icon: "ArrowLeft",
    color: EDGE_COLOR,
    description: "Navigate to previous page in history",
    defaultData: {
      label: "Go Back",
      enabled: true,
      waitForNavigation: true,
    },
    outputSchema: { navigated: "boolean" },
  },

  goForward: {
    type: "goForward",
    label: "Go Forward",
    category: "Web Automation",
    icon: "ArrowRight",
    color: EDGE_COLOR,
    description: "Navigate to next page in history",
    defaultData: {
      label: "Go Forward",
      enabled: true,
      waitForNavigation: true,
    },
    outputSchema: { navigated: "boolean" },
  },

  hoverElement: {
    type: "hoverElement",
    label: "Hover Element",
    category: "Web Automation",
    icon: "MousePointer2",
    color: EDGE_COLOR,
    description: "Hover over elements to trigger tooltips/menus",
    defaultData: {
      label: "Hover Element",
      enabled: true,
      selector: "",
      duration: 500,
    },
    outputSchema: { hovered: "boolean" },
  },

  dragAndDrop: {
    type: "dragAndDrop",
    label: "Drag & Drop",
    category: "Web Automation",
    icon: "Move",
    color: EDGE_COLOR,
    description: "Drag element from source to target",
    defaultData: {
      label: "Drag & Drop",
      enabled: true,
      sourceSelector: "",
      targetSelector: "",
    },
    outputSchema: { dropped: "boolean" },
  },

  pressKey: {
    type: "pressKey",
    label: "Press Key",
    category: "Web Automation",
    icon: "Keyboard",
    color: EDGE_COLOR,
    description: "Simulate keyboard key press",
    defaultData: {
      label: "Press Key",
      enabled: true,
      key: "Enter",
      modifiers: [],
    },
    outputSchema: { pressed: "boolean" },
  },

  executeJavaScript: {
    type: "executeJavaScript",
    label: "Execute JavaScript",
    category: "Web Automation",
    icon: "Code2",
    color: EDGE_COLOR,
    description: "Run custom JavaScript in page context",
    defaultData: {
      label: "Execute JS",
      enabled: true,
      script: "",
      returnValue: true,
    },
    outputSchema: { result: "unknown" },
  },

  reloadPage: {
    type: "reloadPage",
    label: "Reload Page",
    category: "Web Automation",
    icon: "RotateCw",
    color: EDGE_COLOR,
    description: "Reload/refresh current page",
    defaultData: {
      label: "Reload Page",
      enabled: true,
      hardReload: false,
    },
    outputSchema: { reloaded: "boolean" },
  },
};

export function getNodeDefinition(type: NodeType): NodeDefinition {
  const definition = NODE_REGISTRY[type];
  if (!definition) {
    throw new Error(`Node definition not found for type: "${type}"`);
  }
  return definition;
}

export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  const definition = getNodeDefinition(type);

  // Base data (common to all nodes)
  const baseData = {
    label: definition.label,
    enabled: true,
    executionState: "idle" as const,
    errors: [],
    warnings: [],
    lastExecutedAt: null,
    executionCount: 0,
    metadata: {},
    retryCount: 0,
  };

  // Merge with type-specific defaults
  return {
    ...baseData,
    ...definition.defaultData,
  } as WorkflowNodeData;
}

export function getAllCategories(): NodeCategory[] {
  return Array.from(
    new Set(Object.values(NODE_REGISTRY).map((node) => node.category))
  );
}

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter(
    (node) => node.category === category
  );
}

export function searchNodes(query: string): NodeDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(NODE_REGISTRY).filter(
    (node) =>
      node.label.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery) ||
      node.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function isValidNodeType(type: string): type is NodeType {
  return type in NODE_REGISTRY;
}
