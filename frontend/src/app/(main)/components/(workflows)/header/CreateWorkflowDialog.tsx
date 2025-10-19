"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { WorkflowCategory } from "@prisma/client";
import { useCreateWorkflow } from "@/lib/hooks/use-workflow";

const createWorkflowSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  category: z.nativeEnum(WorkflowCategory).optional(),
});

type CreateWorkflowForm = z.infer<typeof createWorkflowSchema>;

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkflowDialog({
  open,
  onOpenChange,
}: CreateWorkflowDialogProps) {
  const createMutation = useCreateWorkflow();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateWorkflowForm>({
    resolver: zodResolver(createWorkflowSchema),
  });

  const onSubmit = (data: CreateWorkflowForm) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a name and description to get started
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Amazon Price Monitor"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                rows={3}
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) =>
                  setValue("category", value as WorkflowCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DATA_EXTRACTION">
                    Data Extraction
                  </SelectItem>
                  <SelectItem value="FORM_SUBMISSION">
                    Form Submission
                  </SelectItem>
                  <SelectItem value="MONITORING">Monitoring</SelectItem>
                  <SelectItem value="TESTING">Testing</SelectItem>
                  <SelectItem value="INTEGRATION">Integration</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Workflow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
