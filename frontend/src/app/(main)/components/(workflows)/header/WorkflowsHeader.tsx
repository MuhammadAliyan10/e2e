"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Download, Settings } from "lucide-react";

import { PageHeader } from "../../header/PageHeader";
import { CreateWorkflowDialog } from "./CreateWorkflowDialog";

export function WorkflowsHeader() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Workflows"
        description="Create, manage, and monitor your automation workflows"
        primaryAction={{
          label: "Create Workflow",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setIsCreateOpen(true),
        }}
        secondaryActions={[
          {
            label: "Import Workflow",
            icon: <Upload className="h-4 w-4" />,
            onClick: () => {},
          },
          {
            label: "Export All",
            icon: <Download className="h-4 w-4" />,
            onClick: () => {},
          },
          {
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
            onClick: () => router.push("/settings/workflows"),
          },
        ]}
      />
      <CreateWorkflowDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
