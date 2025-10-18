import {
  Home,
  Workflow,
  Globe,
  Play,
  BarChart3,
  Settings,
  FileText,
  Code,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const NAVIGATION_CONFIG: NavigationSection[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home },
      { title: "Workflows", href: "/workflows", icon: Workflow },
      { title: "Discovered Sites", href: "/sites", icon: Globe },
      { title: "Executions", href: "/executions", icon: Play },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Shortcuts",
    items: [
      { title: "Create Workflow", href: "/workflows/new", icon: Zap },
      {
        title: "Discover Site",
        href: "/sites/discover",
        icon: Globe,
      },
    ],
  },
  {
    title: "Products",
    collapsible: true,
    defaultOpen: false,
    items: [
      { title: "Automation", href: "/automation", icon: Workflow },
      { title: "Integrations", href: "/integrations", icon: Code },
      { title: "Reporting", href: "/reporting", icon: FileText },
    ],
  },
];

export const BOTTOM_NAVIGATION: NavigationItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Documentation", href: "/docs", icon: FileText },
];
