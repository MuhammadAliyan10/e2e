import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

// Type-safe icon cache
const ICON_CACHE = new Map<string, LucideIcon>();

// Fallback icon for missing/invalid icons
const FALLBACK_ICON: LucideIcon = Icons.HelpCircle;

/**
 * Get Lucide icon component by name with caching
 * @param iconName - String name of Lucide icon (e.g., "Play", "Sparkles")
 * @returns LucideIcon component (guaranteed non-null via fallback)
 */
export function getNodeIcon(iconName: string): LucideIcon {
  // Return cached icon if exists
  if (ICON_CACHE.has(iconName)) {
    return ICON_CACHE.get(iconName)!;
  }

  // Validate input
  if (!iconName || typeof iconName !== "string") {
    console.warn(
      `[getNodeIcon] Invalid icon name: "${iconName}", using fallback`
    );
    ICON_CACHE.set(iconName, FALLBACK_ICON);
    return FALLBACK_ICON;
  }

  // Attempt to resolve icon from lucide-react
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[iconName];

  if (!Icon || typeof Icon !== "function") {
    console.warn(
      `[getNodeIcon] Icon "${iconName}" not found in lucide-react (v${
        require("lucide-react/package.json").version
      }), using fallback`
    );
    ICON_CACHE.set(iconName, FALLBACK_ICON);
    return FALLBACK_ICON;
  }

  // Cache and return
  ICON_CACHE.set(iconName, Icon);
  return Icon;
}

/**
 * Preload common icons at app startup (improves first render perf)
 * Call in app layout or entry point
 */
export function preloadCommonIcons(): void {
  const commonIcons = [
    // Core
    "Play",
    "Sparkles",
    "HelpCircle",
    // Web Automation
    "ExternalLink",
    "MousePointer",
    "Keyboard",
    "ChevronDown",
    "Upload",
    "Download",
    "Clock",
    "FileText",
    "Tag",
    "Camera",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Layers",
    "X",
    "LogIn",
    "Shield",
    "ShieldCheck",
    "Cookie",
    "FileInput",
    "RefreshCw",
    "LogOut",
    "Table",
    "List",
    "Braces",
    "Info",
    "TreeDeciduous",
    "Search",
    "Rss",
    "Repeat",
    "MessageSquare",
    "Maximize",
    "Zap",
    "ArrowDownCircle",
    "Link",
    // Communication
    "Mail",
    "Hash",
    "MessageCircle",
    "Send",
    "Twitter",
    "Instagram",
    "Facebook",
    "Linkedin",
    "Youtube",
    // Productivity
    "HardDrive",
    "Sheet",
    "Database",
    "Trello",
    "Cloud",
    "CloudUpload",
    // Developer Tools
    "Github",
    "Ticket",
    "ShoppingCart",
    "CreditCard",
    "Flame",
    "Box",
    "Cpu",
    // Control Flow
    "GitBranch",
    "LayoutGrid",
    "Repeat",
    "StopCircle",
    "Workflow",
    "RotateCcw",
    "AlertTriangle",
    "Hourglass",
    "CalendarClock",
    "Webhook",
    "Server",
    "FileUp",
    "MailOpen",
    "DatabaseZap",
    "MessageSquareText",
    // AI
    "MessageSquare",
    "ListFilter",
    "PenTool",
    "Extract",
    "Eye",
    "Languages",
    "ScanText",
    "Smile",
    // Data Processing
    "Merge",
    "Split",
    "Filter",
    "Map",
    "Minimize2",
    "ArrowUpDown",
    "FileSpreadsheet",
    "FileCode",
    "Binary",
    "Hash",
    "Regex",
    // Utility
    "Globe",
    "Radio",
    "Terminal",
    "Code",
    "Code2",
    "Settings",
    "AlertOctagon",
    // User Management
    "UserPlus",
    "FolderPlus",
    "Save",
    "FileDown",
    // System Control
    "Activity",
    // Security
    "Lock",
    "Unlock",
    "ShieldCheck",
    "Shield",
    // General
    "Bell",
    "StickyNote",
    "Variable",
    "Clipboard",
  ];

  const startTime = performance.now();
  let loaded = 0;

  commonIcons.forEach((iconName) => {
    if (!ICON_CACHE.has(iconName)) {
      getNodeIcon(iconName);
      loaded++;
    }
  });

  const duration = performance.now() - startTime;
  console.log(
    `[getNodeIcon] Preloaded ${loaded} icons in ${duration.toFixed(
      2
    )}ms (cache size: ${ICON_CACHE.size})`
  );
}

/**
 * Clear icon cache (useful for testing or memory cleanup)
 */
export function clearIconCache(): void {
  const size = ICON_CACHE.size;
  ICON_CACHE.clear();
  console.log(`[getNodeIcon] Cleared icon cache (${size} icons removed)`);
}

/**
 * Get cache statistics (for debugging)
 */
export function getIconCacheStats() {
  return {
    size: ICON_CACHE.size,
    keys: Array.from(ICON_CACHE.keys()),
  };
}

/**
 * Validate if icon exists without caching
 */
export function isValidIconName(iconName: string): boolean {
  if (!iconName || typeof iconName !== "string") return false;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  return Icon && typeof Icon === "function";
}
