"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { sidebarVariants } from "@/lib/animations/sidebar-variants";
import { navigationConfig } from "@/lib/constants/navigation";
import { SidebarUserButton } from "./SidebarUserButton";
import { SidebarLogo } from "./SidebarLogo";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="relative flex h-screen flex-col border-r border-border bg-[#414244] text-foreground"
    >
      {/* Header with Logo and Create Button */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className={collapsed ? "ml-2" : "ml-0"}>
            <SidebarLogo />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-md font-semibold text-muted-foreground-foreground"
            >
              e2e
            </motion.span>
          )}
        </div>
        {!collapsed && (
          <Button
            size="icon"
            className="h-6 w-6 border border-muted-foreground rounded-none bg-transparent hover:border-primary"
          >
            <Plus className="h-3 w-3 text-white" />
          </Button>
        )}
      </div>

      {/* Top Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {navigationConfig.topSection.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  "hover:bg-accent/10",
                  collapsed && "justify-center",
                  isActive && "text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-sm bg-[#535456] "
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 relative z-10",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "relative z-10 text-sm font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Projects Section */}
        {!collapsed && (
          <div className="pt-4">
            <div className="px-3 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Projects
              </span>
            </div>
            {navigationConfig.projectsSection.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors",
                      "hover:bg-accent/10",
                      isActive && "bg-accent/20 text-primary"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 p-3">
        {navigationConfig.bottomSection.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  "hover:bg-accent/10",
                  collapsed && "justify-center",
                  isActive && "bg-accent/20 text-primary"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </div>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </motion.span>
                )}
                {!collapsed && item.expandable && (
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="border-t border-[#535456] p-3">
        <SidebarUserButton collapsed={collapsed} />
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        size="icon"
        variant="ghost"
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border bg-[#1a1a1a] hover:bg-accent/10"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </motion.aside>
  );
}
