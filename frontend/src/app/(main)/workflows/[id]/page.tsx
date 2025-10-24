import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/global.actions";

import { isTemporaryWorkflowId } from "@/lib/utils/workflow-id";
import { WorkflowEditor } from "../../components/(workflows)/editor/workflow/WorkflowEditor";
import { getWorkflow } from "@/lib/actions/workflow.actions";

export const metadata: Metadata = {
  title: "Workflow Editor",
  description: "Design and configure your automation workflow",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkflowEditorPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  // If temporary ID, render empty editor
  if (isTemporaryWorkflowId(id)) {
    return <WorkflowEditor workflowId={id} />;
  }

  // Existing workflow - fetch from DB
  const result = await getWorkflow(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <WorkflowEditor workflowId={id} />;
}
