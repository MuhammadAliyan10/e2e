import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * Safely get Lucide icon by name with fallback
 */
export function getNodeIcon(iconName: string): LucideIcon {
  const Icon = (Icons as any)[iconName];

  if (!Icon) {
    console.warn(
      `Icon "${iconName}" not found in lucide-react, using HelpCircle fallback`
    );
    return Icons.HelpCircle;
  }

  return Icon as LucideIcon;
}

/**
 * Check if icon exists
 */
export function isValidIcon(iconName: string): boolean {
  return iconName in Icons;
}
