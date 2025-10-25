// src/app/(main)/components/(workflows)/editor/NodeSettingsPanel.tsx
"use client";

import { OnClickTriggerConfig } from "./dialog/OnClickTriggerConfig";
import { ClickElementConfig } from "./dialog/browser/ClickElementConfig";
// import { OpenURLConfig } from "./dialog/OpenURLConfig"; // TODO: Implement
// import { FillInputConfig } from "./dialog/FillInputConfig"; // TODO: Implement
// import { SelectDropdownConfig } from "./dialog/SelectDropdownConfig"; // TODO: Implement
// import { UploadFileConfig } from "./dialog/UploadFileConfig"; // TODO: Implement
// import { DownloadFileConfig } from "./dialog/DownloadFileConfig"; // TODO: Implement
// import { WaitForElementConfig } from "./dialog/WaitForElementConfig"; // TODO: Implement
// import { ExtractTextConfig } from "./dialog/ExtractTextConfig"; // TODO: Implement
// import { ExtractAttributeConfig } from "./dialog/ExtractAttributeConfig"; // TODO: Implement
// import { TakeScreenshotConfig } from "./dialog/TakeScreenshotConfig"; // TODO: Implement
// import { ScrollToElementConfig } from "./dialog/ScrollToElementConfig"; // TODO: Implement
// import { GoBackConfig } from "./dialog/GoBackConfig"; // TODO: Implement
// import { GoForwardConfig } from "./dialog/GoForwardConfig"; // TODO: Implement
// import { HoverElementConfig } from "./dialog/HoverElementConfig"; // TODO: Implement
// import { DragAndDropConfig } from "./dialog/DragAndDropConfig"; // TODO: Implement
// import { PressKeyConfig } from "./dialog/PressKeyConfig"; // TODO: Implement
// import { ExecuteJavaScriptConfig } from "./dialog/ExecuteJavaScriptConfig"; // TODO: Implement
// import { ReloadPageConfig } from "./dialog/ReloadPageConfig"; // TODO: Implement

import { NodeConfigDialog } from "./NodeConfigDialog";

import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";

interface NodeSettingsPanelProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
  onExecute?: (nodeId: string) => Promise<void>;
}

export function NodeSettingsPanel({
  node,
  isOpen,
  onClose,
  onUpdate,
  onExecute,
}: NodeSettingsPanelProps) {
  if (!node) return null;

  const handleUpdate = (data: Partial<WorkflowNode["data"]>) => {
    onUpdate(node.id, data);
  };

  const renderConfig = () => {
    switch (node.type) {
      // ============ IMPLEMENTED ============
      case "trigger":
        return (
          <OnClickTriggerConfig
            node={node}
            onUpdate={handleUpdate}
            outputData={
              "outputs" in node.data ? node.data.outputs?.data : undefined
            }
          />
        );

      case "clickElement":
        return <ClickElementConfig node={node} onUpdate={handleUpdate} />;

      // ============ BROWSER AUTOMATION (TODO) ============
      case "openURL":
        // return <OpenURLConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Open URL", node.type);

      case "fillInput":
        // return <FillInputConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Fill Input", node.type);

      case "selectDropdown":
        // return <SelectDropdownConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Select Dropdown", node.type);

      case "uploadFile":
        // return <UploadFileConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Upload File", node.type);

      case "downloadFile":
        // return <DownloadFileConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Download File", node.type);

      case "waitForElement":
        // return <WaitForElementConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Wait For Element", node.type);

      case "extractText":
        // return <ExtractTextConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Extract Text", node.type);

      case "extractAttribute":
        // return <ExtractAttributeConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Extract Attribute", node.type);

      case "takeScreenshot":
        // return <TakeScreenshotConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Take Screenshot", node.type);

      case "scrollToElement":
        // return <ScrollToElementConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Scroll To Element", node.type);

      case "goBack":
        // return <GoBackConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Go Back", node.type);

      case "goForward":
        // return <GoForwardConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Go Forward", node.type);

      case "hoverElement":
        // return <HoverElementConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Hover Element", node.type);

      case "dragAndDrop":
        // return <DragAndDropConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Drag & Drop", node.type);

      case "pressKey":
        // return <PressKeyConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Press Key", node.type);

      case "executeJavaScript":
        // return <ExecuteJavaScriptConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Execute JavaScript", node.type);

      case "reloadPage":
        // return <ReloadPageConfig node={node} onUpdate={handleUpdate} />;
        return renderComingSoon("Reload Page", node.type);

      // ============ FALLBACK ============
      default:
        return renderUnknown(node.type);
    }
  };

  const renderComingSoon = (label: string, type: string) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-6 border-2 border-dashed border-[#3a3a3a]">
        <span className="text-4xl">🚧</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{label}</h3>
      <p className="text-sm text-[#919298] mb-4 max-w-md">
        Configuration panel for this node is under development. You can still
        use the node with default settings.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <div className="text-xs text-[#606060] bg-[#2a2a2a] px-4 py-3 rounded-md border border-[#3a3a3a]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white">Node Type</span>
            <code className="text-primary">{type}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Status</span>
            <span className="text-yellow-400">In Development</span>
          </div>
        </div>
        <div className="text-xs text-[#606060] bg-blue-500/5 px-4 py-3 rounded-md border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <span>💡</span>
            <span className="font-semibold">Quick Tip</span>
          </div>
          <p>
            Default configuration will be used until this panel is implemented.
          </p>
        </div>
      </div>
    </div>
  );

  const renderUnknown = (type: string) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border-2 border-red-500/30">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Unknown Node Type
      </h3>
      <p className="text-sm text-[#919298] mb-4 max-w-md">
        Configuration panel not found for this node type. This may indicate a
        version mismatch or unregistered node.
      </p>
      <div className="text-xs text-red-400 bg-red-500/10 px-4 py-3 rounded-md border border-red-500/30 max-w-sm">
        <div className="font-mono">
          <span className="text-red-300">Unrecognized type:</span>{" "}
          <code>{type}</code>
        </div>
      </div>
      <div className="mt-6 text-xs text-[#606060]">
        <p>Please check:</p>
        <ul className="list-disc list-inside mt-2 text-left">
          <li>Node registry is up to date</li>
          <li>Node type is registered in NodeSettingsPanel</li>
          <li>No typos in node type definition</li>
        </ul>
      </div>
    </div>
  );

  return (
    <NodeConfigDialog
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onUpdate={onUpdate}
      onExecute={onExecute}
    >
      {renderConfig()}
    </NodeConfigDialog>
  );
}
