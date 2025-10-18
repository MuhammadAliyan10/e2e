"use client";

import { ReactNode } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  }>;
}

export function PageHeader({
  title,
  description,
  actions,
  primaryAction,
  secondaryActions,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {(actions || primaryAction || secondaryActions) && (
          <div className="flex items-center gap-2">
            {actions}

            {secondaryActions && secondaryActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {secondaryActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className="cursor-pointer"
                    >
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {primaryAction && (
              <Button onClick={primaryAction.onClick} className="gap-2">
                {primaryAction.icon || <Plus className="h-4 w-4" />}
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
      <Separator />
    </div>
  );
}
