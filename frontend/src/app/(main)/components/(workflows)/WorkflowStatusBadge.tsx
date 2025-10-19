import { Badge } from "@/components/ui/badge";
import { WorkflowStatus } from "@prisma/client";
import { Circle } from "lucide-react";

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    variant: "secondary" as const,
    color: "text-gray-500",
  },
  PUBLISHED: {
    label: "Published",
    variant: "default" as const,
    color: "text-green-500",
  },
  PAUSED: {
    label: "Paused",
    variant: "outline" as const,
    color: "text-yellow-500",
  },
  ARCHIVED: {
    label: "Archived",
    variant: "secondary" as const,
    color: "text-gray-400",
  },
};

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Circle className={`h-2 w-2 fill-current ${config.color}`} />
      {config.label}
    </Badge>
  );
}
