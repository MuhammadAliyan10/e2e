// src/lib/validation/browser-node.schema.ts
import { z } from "zod";

export const ClickElementSchema = z.object({
  selector: z.string().min(1, "Selector is required"),
  selectorType: z.enum(["css", "xpath", "text", "aria"]).default("css"),
  clickType: z.enum(["single", "double", "right"]).default("single"),
  waitForElement: z.boolean().default(true),
  waitTimeout: z.number().min(0).max(60000).default(10000),
  scrollIntoView: z.boolean().default(true),
  forceClick: z.boolean().default(false),
  coordinates: z
    .object({
      x: z.number().min(0),
      y: z.number().min(0),
    })
    .optional(),
  modifiers: z.array(z.enum(["Alt", "Control", "Meta", "Shift"])).optional(),
});

export type ClickElementInput = z.infer<typeof ClickElementSchema>;
