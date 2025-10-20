import {
  Home,
  User,
  Layers,
  Cloud,
  Package,
  X,
  BarChart3,
  HelpCircle,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
  expandable?: boolean;
}

interface NavigationConfig {
  topSection: NavItem[];
  projectsSection: NavItem[];
  bottomSection: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  topSection: [
    {
      title: "Overview",
      href: "/home",
      icon: Home,
    },
    {
      title: "Personal",
      href: "/home/personal",
      icon: User,
    },
  ],
  projectsSection: [
    {
      title: "My project",
      href: "/home/projects",
      icon: Layers,
    },
  ],
  bottomSection: [
    {
      title: "Admin Panel",
      href: "/home/admin",
      icon: Cloud,
    },
    {
      title: "Templates",
      href: "/home/templates",
      icon: Package,
    },
    {
      title: "Variables",
      href: "/home/variables",
      icon: X,
    },
    {
      title: "Insights",
      href: "/home/insights",
      icon: BarChart3,
    },
    {
      title: "Help",
      href: "/home/help",
      icon: HelpCircle,
      expandable: true,
    },
    {
      title: "What's New",
      href: "/home/whats-new",
      icon: Bell,
      badge: "new",
      expandable: true,
    },
  ],
};
