import { WorkflowEditor } from "@/app/(main)/components/(workflows)/editor/workflow/WorkflowEditor";
import { WorkflowErrorBoundary } from "@/app/(main)/components/(workflows)/editor/workflow/WorkflowErrorBoundary";
import { Metadata } from "next";

import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({}: PageProps): Promise<Metadata> {
  return {
    title: `Edit Workflow`,
  };
}

export default async function WorkflowEditorPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <WorkflowErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading workflow editor...
              </p>
            </div>
          </div>
        }
      >
        <WorkflowEditor workflowId={id} />
      </Suspense>
    </WorkflowErrorBoundary>
  );
}
