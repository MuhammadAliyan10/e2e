"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Code, Check, X } from "lucide-react";

interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ExpressionEditor({
  value,
  onChange,
  placeholder,
}: ExpressionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateExpression = (expr: string) => {
    try {
      // Basic validation - check for balanced brackets
      const openBrackets = (expr.match(/\{\{/g) || []).length;
      const closeBrackets = (expr.match(/\}\}/g) || []).length;
      setIsValid(openBrackets === closeBrackets);
    } catch {
      setIsValid(false);
    }
  };

  const handleApply = () => {
    onChange(localValue);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter value or expression"}
        className="flex-1"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" title="Expression editor">
            <Code className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Expression Builder</label>
              <p className="text-xs text-muted-foreground mt-1">
                Use {`{{variable.path}}`} syntax to reference data
              </p>
            </div>

            <div className="space-y-2">
              <Input
                value={localValue}
                onChange={(e) => {
                  setLocalValue(e.target.value);
                  validateExpression(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValid !== false) {
                    handleApply();
                  }
                }}
                placeholder="{{previousNode.output.data}}"
                className="font-mono text-sm"
              />

              {isValid !== null && (
                <div className="flex items-center gap-2 text-xs">
                  {isValid ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">Valid expression</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">Invalid syntax</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                size="sm"
                disabled={isValid === false}
                className="flex-1"
              >
                Apply
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-medium mb-2">Common Expressions:</p>
              <div className="space-y-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] cursor-pointer"
                  onClick={() => setLocalValue("{{$input}}")}
                >
                  {`{{$input}}`} - All inputs
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] cursor-pointer"
                  onClick={() => setLocalValue("{{$vars.apiKey}}")}
                >
                  {`{{$vars.apiKey}}`} - Workflow variable
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] cursor-pointer"
                  onClick={() => setLocalValue("{{$item}}")}
                >
                  {`{{$item}}`} - Loop current item
                </Badge>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
