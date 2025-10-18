"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
import { FloatingDock } from "./floating-dock";

import {
  BookOpen,
  DollarSign,
  GitFork,
  Home,
  SquareArrowOutUpRight,
} from "lucide-react";

export function FloatingDockMenu() {
  const pathname = usePathname(); // For App Router
  // OR const router = useRouter(); const pathname = router.pathname; // For Pages Router

  const links = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-neutral-300" />,
      href: "/",
    },
    {
      title: "About",
      icon: <BookOpen className="h-full w-full text-neutral-300" />,
      href: "/about",
    },
    {
      title: "How Its Work",
      icon: <GitFork className="h-full w-full text-neutral-300" />,
      href: "/how-it-works",
    },
    {
      title: "Pricing",
      icon: <DollarSign className="h-full w-full text-neutral-300" />,
      href: "/pricing",
    },
    {
      title: "Get Started",
      icon: (
        <SquareArrowOutUpRight className="h-full w-full text-neutral-300" />
      ),
      href: "/signin",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
      <FloatingDock
        items={links}
        desktopClassName="bg-neutral-900/90 backdrop-blur-md border border-gray-600"
        mobileClassName="bg-neutral-800/90 backdrop-blur-md border border-gray-600"
        activeHref={pathname}
      />
    </div>
  );
}
