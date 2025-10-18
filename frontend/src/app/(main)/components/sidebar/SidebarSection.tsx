"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { sectionVariants } from "@/lib/animations/sidebar-variants";

interface SidebarSectionProps {
  title?: string;
  items: Array<{
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
    disabled?: boolean;
  }>;
  collapsible?: boolean;
  defaultOpen?: boolean;
  collapsed?: boolean;
}

export function SidebarSection({
  title,
  items,
  collapsible = false,
  defaultOpen = true,
  collapsed = false,
}: SidebarSectionProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsible && !collapsed) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between px-3 py-2 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">{title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sectionVariants}
              className="space-y-1 overflow-hidden"
            >
              {items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {title && !collapsed && (
        <div className="px-3 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>
      )}
      {items.map((item) => (
        <SidebarNavItem
          key={item.href}
          item={item}
          pathname={pathname}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
}

function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarSectionProps["items"][0];
  pathname: string;
  collapsed: boolean;
}) {
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 h-auto relative transition-all duration-200",
        collapsed && "justify-center px-2",
        isActive &&
          "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium",
        item.disabled && "opacity-50 cursor-not-allowed"
      )}
      asChild
      disabled={item.disabled}
    >
      <Link href={item.href}>
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-primary/10 rounded-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 relative z-10",
            collapsed && "h-6 w-6"
          )}
        />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-1 items-center justify-between overflow-hidden relative z-10"
            >
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </Button>
  );
}
