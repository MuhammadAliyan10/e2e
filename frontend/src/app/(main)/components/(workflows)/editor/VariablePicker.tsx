"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Variable } from "lucide-react";

interface VariablePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Mock available variables (would come from workflow context)
const AVAILABLE_VARIABLES = [
  {
    value: "{{$input.navigate1.url}}",
    label: "Navigate URL",
    category: "Navigate",
  },
  {
    value: "{{$input.extract1.data}}",
    label: "Extracted Data",
    category: "Extract",
  },
  { value: "{{$vars.apiKey}}", label: "API Key", category: "Variables" },
  { value: "{{$item}}", label: "Current Item", category: "Loop" },
  { value: "{{$index}}", label: "Loop Index", category: "Loop" },
];

export function VariablePicker({
  value,
  onChange,
  placeholder,
}: VariablePickerProps) {
  const [open, setOpen] = useState(false);

  const insertVariable = (variable: string) => {
    const cursorPosition = value.length;
    const newValue =
      value.slice(0, cursorPosition) + variable + value.slice(cursorPosition);
    onChange(newValue);
    setOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter value or use variables"}
        className="flex-1"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" title="Insert variable">
            <Variable className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Command>
            <CommandInput placeholder="Search variables..." />
            <CommandList>
              <CommandEmpty>No variables found.</CommandEmpty>
              <CommandGroup heading="Available Variables">
                {AVAILABLE_VARIABLES.map((variable) => (
                  <CommandItem
                    key={variable.value}
                    onSelect={() => insertVariable(variable.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {variable.label}
                      </span>
                      <code className="text-xs text-muted-foreground">
                        {variable.value}
                      </code>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
