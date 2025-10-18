"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tally2, Tally1 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import {
  NAVIGATION_CONFIG,
  BOTTOM_NAVIGATION,
} from "@/lib/constants/navigation";
import { sidebarVariants } from "@/lib/animations/sidebar-variants";
import { SidebarSection } from "./SidebarSection";
import { SidebarUserButton } from "./SidebarUserButton";
import Logo from "@/components/Global/logo/Logo";

export function Sidebar() {
  const { isOpen, isMobileOpen, toggle, closeMobile } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobile();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobile]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r bg-background",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 ease-in-out lg:transition-none"
        )}
      >
        <div className="flex h-full flex-col relative">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-3 shrink-0">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between w-full"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <Logo />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobile}
                    className="lg:hidden h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex justify-center"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center"
                  >
                    <Image
                      src="/Logo.png"
                      alt="e2e Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-4">
            <div className="space-y-4">
              {NAVIGATION_CONFIG.map((section, index) => (
                <div key={index}>
                  <SidebarSection
                    title={section.title}
                    items={section.items}
                    collapsible={section.collapsible}
                    defaultOpen={section.defaultOpen}
                    collapsed={!isOpen}
                  />
                  {index < NAVIGATION_CONFIG.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Collapse/Expand Button - Centered Vertically */}
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-10 hidden lg:block">
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              className="h-6 w-6 text-primary transition-all border-0"
            >
              {isOpen ? (
                <Tally2 className="h-6 w-6" />
              ) : (
                <Tally1 className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t p-2 shrink-0">
            <div className="space-y-1 mb-2">
              {BOTTOM_NAVIGATION.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2 h-auto relative overflow-hidden",
                      !isOpen && "justify-center px-2"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon
                        className={cn("h-5 w-5 shrink-0", !isOpen && "h-6 w-6")}
                      />
                      <AnimatePresence mode="wait">
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="truncate"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </Button>
                );
              })}
            </div>
            <Separator className="my-2" />
            <div className="lg:hidden">
              <SidebarUserButton collapsed={!isOpen} />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
