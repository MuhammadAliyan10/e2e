"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Plus,
  Trash2,
  Globe,
  Lock,
  Info,
  Loader2,
  Palette,
  Key,
  User,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  prompt: string;
  color?: string;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
    customFields?: Record<string, string>;
  };
}

export interface AiWorkflowConfig {
  mode: "text" | "steps";
  prompt?: string;
  steps?: WorkflowStep[];
  targetUrl: string;
  globalCredentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

interface AiWorkflowGeneratorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (config: AiWorkflowConfig) => Promise<void>;
}

const PRESET_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Green", value: "#22c55e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Pink", value: "#ec4899" },
];

export function AiWorkflowGeneratorSheet({
  open,
  onOpenChange,
  onGenerate,
}: AiWorkflowGeneratorSheetProps) {
  const [mode, setMode] = useState<"text" | "steps">("text");
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: "step-1", prompt: "", color: "#3b82f6" },
  ]);
  const [targetUrl, setTargetUrl] = useState("");
  const [globalCredentials, setGlobalCredentials] = useState({
    username: "",
    password: "",
    apiKey: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  // Add new step
  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      prompt: "",
      color: PRESET_COLORS[steps.length % PRESET_COLORS.length].value,
    };
    setSteps([...steps, newStep]);
    toast.success("Step added");
  };

  // Remove step
  const handleRemoveStep = (stepId: string) => {
    if (steps.length === 1) {
      toast.error("At least one step is required");
      return;
    }
    setSteps(steps.filter((s) => s.id !== stepId));
    toast.success("Step removed");
  };

  // Update step field
  const handleUpdateStep = (
    stepId: string,
    field: keyof WorkflowStep,
    value: any
  ) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          if (field === "credentials") {
            return {
              ...s,
              credentials: {
                ...s.credentials,
                ...value,
              },
            };
          }
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  // Add custom credential field
  const handleAddCustomField = (stepId: string) => {
    const fieldName = window.prompt(
      `Enter field name (e.g., "API Token", "Client ID"):`
    );
    if (!fieldName) return;

    handleUpdateStep(stepId, "credentials", {
      customFields: {
        ...(steps.find((s) => s.id === stepId)?.credentials?.customFields ||
          {}),
        [fieldName]: "",
      },
    });
    toast.success(`Custom field "${fieldName}" added`);
  };

  // Remove custom credential field
  const handleRemoveCustomField = (stepId: string, fieldName: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step?.credentials?.customFields) return;

    const { [fieldName]: _, ...remainingFields } =
      step.credentials.customFields;

    handleUpdateStep(stepId, "credentials", {
      customFields: remainingFields,
    });
    toast.success(`Custom field "${fieldName}" removed`);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // Validate inputs
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === "text" && !prompt.trim()) {
      newErrors.prompt = "Prompt is required";
    }

    if (mode === "steps") {
      const emptySteps = steps.filter((s) => !s.prompt.trim());
      if (emptySteps.length > 0) {
        newErrors.steps = `${emptySteps.length} step(s) have empty prompts`;
      }
    }

    if (!targetUrl.trim()) {
      newErrors.targetUrl = "Target URL is required";
    } else {
      try {
        new URL(targetUrl);
      } catch {
        newErrors.targetUrl = "Invalid URL format (must include https://)";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  // Handle generation
  const handleGenerate = async () => {
    if (!validate()) return;

    setIsGenerating(true);

    try {
      const config: AiWorkflowConfig = {
        mode,
        prompt: mode === "text" ? prompt : undefined,
        steps: mode === "steps" ? steps : undefined,
        targetUrl,
        globalCredentials:
          globalCredentials.username ||
          globalCredentials.password ||
          globalCredentials.apiKey
            ? globalCredentials
            : undefined,
      };

      await onGenerate(config);

      // Reset form
      setPrompt("");
      setSteps([{ id: "step-1", prompt: "", color: "#3b82f6" }]);
      setTargetUrl("");
      setGlobalCredentials({ username: "", password: "", apiKey: "" });
      setErrors({});

      onOpenChange(false);
      toast.success("AI workflow generated successfully");
    } catch (error: any) {
      console.error("[AIGenerator] Generation failed:", error);
      toast.error(error.message || "Failed to generate workflow");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-2xl p-0  border-border overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-xl text-white">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Workflow Generator
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            Describe your automation and let AI generate the workflow
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Mode Selection */}
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "text" | "steps")}
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="text" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Simple Prompt
                </TabsTrigger>
                <TabsTrigger value="steps" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Step-by-Step
                </TabsTrigger>
              </TabsList>

              {/* Simple Prompt Mode */}
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-white">
                    Describe Your Task *
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Login to dashboard with username and password, navigate to products page, extract all product names and prices, then export to CSV"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className={cn(
                      "bg-slate-800 border-border text-white resize-none",
                      errors.prompt && "border-red-500"
                    )}
                  />
                  {errors.prompt && (
                    <p className="text-xs text-red-400">{errors.prompt}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Be specific about actions, credentials needed, and expected
                    outputs. AI will parse and create nodes automatically.
                  </p>
                </div>
              </TabsContent>

              {/* Step-by-Step Mode */}
              <TabsContent value="steps" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="p-4  rounded-lg border border-border space-y-4"
                    >
                      {/* Step Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-300 border-purple-500/30"
                          >
                            Step {index + 1}
                          </Badge>
                          {/* Color Picker */}
                          <div className="flex items-center gap-1">
                            <Palette className="w-3 h-3 text-slate-400" />
                            <Select
                              value={step.color}
                              onValueChange={(value) =>
                                handleUpdateStep(step.id, "color", value)
                              }
                            >
                              <SelectTrigger className="h-7 w-[100px]  border-border text-xs">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: step.color }}
                                  />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-border">
                                {PRESET_COLORS.map((color) => (
                                  <SelectItem
                                    key={color.value}
                                    value={color.value}
                                    className="text-white"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      {color.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {steps.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStep(step.id)}
                            className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Step Prompt */}
                      <div className="space-y-2">
                        <Label className="text-white text-xs">
                          Action Description *
                        </Label>
                        <Textarea
                          placeholder={`Example: ${
                            index === 0
                              ? "Navigate to login page and enter credentials"
                              : index === 1
                              ? "Click on 'Products' menu item"
                              : "Extract product data from table"
                          }`}
                          value={step.prompt}
                          onChange={(e) =>
                            handleUpdateStep(step.id, "prompt", e.target.value)
                          }
                          rows={3}
                          className="bg-slate-900/50 border-border text-white text-sm"
                        />
                      </div>

                      {/* Credentials Section */}
                      <details className="group">
                        <summary className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white">
                          <Lock className="w-3 h-3" />
                          Step-Specific Credentials (Optional)
                        </summary>
                        <div className="mt-3 space-y-3 pl-5">
                          {/* Username */}
                          <div className="space-y-1">
                            <Label className="text-white text-xs flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Username
                            </Label>
                            <Input
                              placeholder="username@example.com"
                              value={step.credentials?.username || ""}
                              onChange={(e) =>
                                handleUpdateStep(step.id, "credentials", {
                                  username: e.target.value,
                                })
                              }
                              className="bg-slate-900/50 border-border text-white text-xs"
                            />
                          </div>

                          {/* Password */}
                          <div className="space-y-1">
                            <Label className="text-white text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                type={
                                  showPassword[`${step.id}-password`]
                                    ? "text"
                                    : "password"
                                }
                                placeholder="••••••••"
                                value={step.credentials?.password || ""}
                                onChange={(e) =>
                                  handleUpdateStep(step.id, "credentials", {
                                    password: e.target.value,
                                  })
                                }
                                className="bg-slate-900/50 border-border text-white text-xs pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    `${step.id}-password`
                                  )
                                }
                              >
                                {showPassword[`${step.id}-password`] ? (
                                  <EyeOff className="h-3 w-3 text-slate-400" />
                                ) : (
                                  <Eye className="h-3 w-3 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* API Key */}
                          <div className="space-y-1">
                            <Label className="text-white text-xs flex items-center gap-1">
                              <Key className="w-3 h-3" />
                              API Key
                            </Label>
                            <div className="relative">
                              <Input
                                type={
                                  showPassword[`${step.id}-apikey`]
                                    ? "text"
                                    : "password"
                                }
                                placeholder="sk_..."
                                value={step.credentials?.apiKey || ""}
                                onChange={(e) =>
                                  handleUpdateStep(step.id, "credentials", {
                                    apiKey: e.target.value,
                                  })
                                }
                                className="bg-slate-900/50 border-border text-white text-xs pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility(`${step.id}-apikey`)
                                }
                              >
                                {showPassword[`${step.id}-apikey`] ? (
                                  <EyeOff className="h-3 w-3 text-slate-400" />
                                ) : (
                                  <Eye className="h-3 w-3 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Custom Fields */}
                          {step.credentials?.customFields &&
                            Object.entries(step.credentials.customFields).map(
                              ([fieldName, fieldValue]) => (
                                <div key={fieldName} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-white text-xs">
                                      {fieldName}
                                    </Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 text-red-400 hover:text-red-300"
                                      onClick={() =>
                                        handleRemoveCustomField(
                                          step.id,
                                          fieldName
                                        )
                                      }
                                    >
                                      <Trash2 className="h-2.5 w-2.5" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={fieldValue}
                                    onChange={(e) =>
                                      handleUpdateStep(step.id, "credentials", {
                                        customFields: {
                                          ...step.credentials?.customFields,
                                          [fieldName]: e.target.value,
                                        },
                                      })
                                    }
                                    className="bg-slate-900/50 border-border text-white text-xs"
                                  />
                                </div>
                              )
                            )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddCustomField(step.id)}
                            className="w-full gap-2 border-border hover:bg-slate-800 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                            Add Custom Field
                          </Button>
                        </div>
                      </details>
                    </div>
                  ))}

                  {errors.steps && (
                    <p className="text-xs text-red-400">{errors.steps}</p>
                  )}

                  <Button
                    onClick={handleAddStep}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-border hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="bg-slate-700" />

            {/* Target URL */}
            <div className="space-y-2">
              <Label
                htmlFor="targetUrl"
                className="flex items-center gap-2 text-white"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                Target Website URL *
              </Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://example.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className={cn(
                  "bg-slate-800 border-border text-white",
                  errors.targetUrl && "border-red-500"
                )}
              />
              {errors.targetUrl && (
                <p className="text-xs text-red-400">{errors.targetUrl}</p>
              )}
              <p className="text-xs text-slate-400">
                AI will analyze this website to generate appropriate nodes
              </p>
            </div>

            {/* Global Credentials (Optional) */}
            <details className="space-y-3 p-4 bg-slate-800/30 rounded-lg border border-border">
              <summary className="flex items-center gap-2 text-sm text-white cursor-pointer font-medium">
                <Shield className="w-4 h-4 text-green-400" />
                Global Credentials (Applied to All Steps)
              </summary>
              <div className="space-y-3 pt-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">Username</Label>
                  <Input
                    placeholder="Global username"
                    value={globalCredentials.username}
                    onChange={(e) =>
                      setGlobalCredentials((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="bg-slate-900/50 border-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white text-xs">Password</Label>
                  <div className="relative">
                    <Input
                      type={
                        showPassword["global-password"] ? "text" : "password"
                      }
                      placeholder="Global password"
                      value={globalCredentials.password}
                      onChange={(e) =>
                        setGlobalCredentials((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="bg-slate-900/50 border-border text-white text-xs pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                      onClick={() =>
                        togglePasswordVisibility("global-password")
                      }
                    >
                      {showPassword["global-password"] ? (
                        <EyeOff className="h-3 w-3 text-slate-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-white text-xs">API Key</Label>
                  <Input
                    type={showPassword["global-apikey"] ? "text" : "password"}
                    placeholder="Global API key"
                    value={globalCredentials.apiKey}
                    onChange={(e) =>
                      setGlobalCredentials((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    className="bg-slate-900/50 border-border text-white text-xs"
                  />
                </div>
              </div>
            </details>

            {/* Info Alert */}
            <Alert className="border-blue-500/30 bg-blue-500/5">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-slate-300 text-xs">
                AI will discover interactive elements, analyze site structure,
                and generate workflow nodes. All credentials are encrypted
                before storage.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t border-border flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
            className="flex-1 border-border hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
