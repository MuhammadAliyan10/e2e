"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarNotifications } from "./NavbarNotifications";
import { NavbarUserMenu } from "./NavbarUserMenu";

export function Navbar() {
  const { toggleMobile } = useSidebar();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobile}
        className="lg:hidden shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar - Left Side */}
      <div className="flex-1 max-w-md">
        <NavbarSearch />
      </div>

      {/* Breadcrumbs - Hidden on Mobile */}
      <div className="hidden lg:flex items-center gap-2 text-sm flex-1">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={cn(
                "transition-colors",
                index === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              )}
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-y-2 gap-x-4 ml-auto shrink-0">
        <NavbarNotifications />
        <NavbarUserMenu />
      </div>
    </header>
  );
}
