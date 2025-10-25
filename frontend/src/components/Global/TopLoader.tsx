"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip NProgress on first render
    if (typeof window !== "undefined") {
      NProgress.start();
      const timer = setTimeout(() => {
        NProgress.done();
      }, 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pathname]);

  return null;
}
