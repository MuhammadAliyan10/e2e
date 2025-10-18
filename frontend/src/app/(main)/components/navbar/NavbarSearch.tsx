"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Home, Workflow, Globe, Play, Settings } from "lucide-react";
import { useCommandPalette } from "@/lib/hooks/use-command-palette";

export function NavbarSearch() {
  const router = useRouter();
  const { isOpen, close } = useCommandPalette();

  const runCommand = (command: () => void) => {
    close();
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground h-9"
        onClick={() => useCommandPalette.getState().open()}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline">Search workflows, sites...</span>
        <span className="inline lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={close}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/workflows"))
              }
            >
              <Workflow className="mr-2 h-4 w-4" />
              <span>Workflows</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/sites"))}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>Discovered Sites</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/executions"))
              }
            >
              <Play className="mr-2 h-4 w-4" />
              <span>Executions</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/settings"))
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
