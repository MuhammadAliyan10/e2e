"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ArrowLeft, Copy } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class WorkflowErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Workflow editor critical error:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Send to error tracking
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          feature: "workflow-editor",
        },
      });
    }

    this.setState({ errorInfo });
  }

  private copyErrorToClipboard = () => {
    const errorText = `Error: ${this.state.error?.message}\n\nStack:\n${this.state.error?.stack}`;
    navigator.clipboard.writeText(errorText);
    alert("Error details copied to clipboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen p-8 bg-muted/30">
          <Alert variant="destructive" className="max-w-3xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Workflow Editor Error
            </AlertTitle>
            <AlertDescription className="mt-4 space-y-4">
              <p className="font-medium text-base">
                {this.state.error?.message ||
                  "An unexpected error occurred while loading the workflow editor."}
              </p>

              <div className="p-3 bg-background/50 rounded border">
                <p className="text-sm font-medium mb-2">Common causes:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Corrupted workflow data with invalid node types</li>
                  <li>Missing node definitions in registry</li>
                  <li>
                    Browser extension conflicts (React DevTools, ad blockers)
                  </li>
                  <li>Outdated cached data (try hard refresh: Ctrl+Shift+R)</li>
                </ul>
              </div>

              {process.env.NODE_ENV === "development" &&
                this.state.error?.stack && (
                  <details className="text-xs">
                    <summary className="cursor-pointer mb-2 font-medium">
                      Stack Trace (Development Only)
                    </summary>
                    <pre className="bg-background p-3 rounded overflow-x-auto border">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}

              <div className="flex gap-2 pt-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Editor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (window.location.href = "/dashboard/workflows")
                  }
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Workflows
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.copyErrorToClipboard}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Error
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                If this error persists, please contact support with the error
                details.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
