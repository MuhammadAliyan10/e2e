# Horizen AI - Workflow Editor

## Overview

Enterprise-grade visual workflow builder with real-time collaboration, offline support, and intelligent auto-save.

---

## Workflow Features

### **1. Auto-Save System**

**How:** Detects changes via hash comparison, debounces saves (3s), periodic backup (5min)
**Why:** Prevents data loss, reduces server load, only saves when needed

### **2. Undo/Redo History**

**How:** LocalStorage-backed state snapshots (max 50), keyboard shortcuts (Ctrl+Z/Y)
**Why:** Enables risk-free experimentation, recovers from mistakes, persists across sessions

### **3. Change Detection**

**How:** Serializes nodes/edges to JSON hash, compares before/after states
**Why:** Eliminates unnecessary saves, shows unsaved indicator, tracks dirty state

### **4. Bulk Import Validation**

**How:** Zod-like validation for nodes/edges arrays, type checks, position validation
**Why:** Prevents corrupt workflows, validates external JSON, ensures type safety

### **5. Visual Node Canvas**

**How:** React Flow with custom nodes/edges, minimap, zoom controls, auto-layout
**Why:** Intuitive drag-drop UX, real-time preview, production-grade graph rendering

### **6. Keyboard Shortcuts**

**How:** Event listeners for `Ctrl+Z` (undo), `Ctrl+Shift+Z` (redo), `Delete` (remove node)
**Why:** Power-user efficiency, reduces mouse dependency, industry-standard bindings

### **7. Type-Safe Event Handling**

**How:** TypeScript strict mode, typed callbacks, Zod validation on boundaries
**Why:** Compile-time safety, autocomplete support, prevents runtime errors

### **8. Error Boundaries**

**How:** Try-catch blocks, fallback UI, structured logging with workflow context
**Why:** Graceful degradation, debuggable errors, prevents app crashes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WorkflowEditor (Parent)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ReactFlowProvider (State Container)                  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ WorkflowEditorContent (Main Logic)             │  │   │
│  │  │  • useNodesState/useEdgesState                 │  │   │
│  │  │  • Auto-save debouncer                         │  │   │
│  │  │  • History manager (localStorage)              │  │   │
│  │  │  • Change detector (hash-based)                │  │   │
│  │  │                                                 │  │   │
│  │  │  Components:                                   │  │   │
│  │  │  ├─ WorkflowNavbar (controls)                  │  │   │
│  │  │  ├─ ReactFlow (canvas)                         │  │   │
│  │  │  ├─ AddNodeSheet (node picker)                 │  │   │
│  │  │  ├─ NodeSettingsPanel (config)                 │  │   │
│  │  │  └─ HistoryComparisonDialog (diff viewer)      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management

### **Workflow State**

- `nodes: Node[]` - Graph nodes (trigger, actions, conditions)
- `edges: DataEdge[]` - Connections between nodes
- `workflowName: string` - User-editable title
- `hasUnsavedChanges: boolean` - Dirty state indicator

### **History State**

- `history: HistoryState[]` - Snapshots (max 50)
- `historyIndex: number` - Current position in timeline
- `isApplyingHistory: boolean` - Prevent recursive saves

### **UI State**

- `selectedNode: WorkflowNode | null` - Active node for editing
- `isPanelOpen: boolean` - Settings panel visibility
- `validationErrors: string[]` - Real-time validation messages

---

## Data Flow

### **Save Workflow**

1. User modifies nodes/edges → `onNodesChange`/`onEdgesChange`
2. Generate hash → `generateWorkflowHash(nodes, edges)`
3. Compare with `lastSavedHash` → set `hasUnsavedChanges`
4. Debounce timer (3s) → `handleAutoSave()`
5. Validate graph → `validateWorkflowGraph()`
6. Call `saveWorkflow()` → POST `/api/workflows/{id}`
7. Update `lastSavedHash` → clear `hasUnsavedChanges`

### **Undo/Redo**

1. User presses `Ctrl+Z` → `handleUndo()`
2. Show diff dialog → `HistoryComparisonDialog`
3. User confirms → `applyHistoryState(targetIndex)`
4. Restore snapshot → `setNodes(history[index].nodes)`
5. Update `historyIndex` → trigger re-render

---

## Best Practices

### **Performance**

- ✅ Memoize expensive computations (`useMemo` for node lists)
- ✅ Debounce auto-save (prevent server hammering)
- ✅ Lazy-load node settings panels
- ✅ Virtual scrolling for large graphs (future: >100 nodes)

### **Security**

- ✅ Validate imported JSON structure
- ✅ Sanitize node labels/descriptions (XSS prevention)
- ✅ CSRF protection on save endpoints
- ✅ Rate-limit auto-save requests (max 1/3s)

### **UX**

- ✅ Show unsaved indicator (yellow badge)
- ✅ Confirm before destructive actions (delete node)
- ✅ Keyboard shortcuts for power users
- ✅ Auto-position for clean layout

---

## API Integration

### **Save Workflow**

```typescript
POST /api/workflows/:id
Body: {
  nodes: WorkflowNode[],
  edges: DataEdge[],
  variables: Record<string, any>,
  version: number
}
Response: { id: string, version: number, updatedAt: Date }
```

### **Load Workflow**

```typescript
GET /api/workflows/:id
Response: {
  id: string,
  name: string,
  nodes: Node[],
  edges: DataEdge[],
  status: "DRAFT" | "PUBLISHED",
  version: number
}
```

---

## Environment Variables

```env
# Workflow auto-save interval (ms)
NEXT_PUBLIC_AUTO_SAVE_DEBOUNCE_MS=3000

# Maximum history snapshots
NEXT_PUBLIC_MAX_HISTORY_SIZE=50

# Enable offline mode (future)
NEXT_PUBLIC_ENABLE_OFFLINE=true
```

---

## Testing

### **Unit Tests** (Jest)

```typescript
describe("WorkflowEditor", () => {
  it("detects changes via hash comparison", () => {
    const hash1 = generateWorkflowHash(nodes1, edges1);
    const hash2 = generateWorkflowHash(nodes2, edges2);
    expect(hash1).not.toBe(hash2);
  });

  it("validates imported workflows", () => {
    const invalidGraph = { nodes: "invalid", edges: [] };
    const result = validateWorkflowImport(invalidGraph);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing or invalid 'nodes' array");
  });
});
```

### **E2E Tests** (Playwright)

```typescript
test("auto-saves workflow after 3 seconds", async ({ page }) => {
  await page.goto("/workflows/new");
  await page.click('[data-testid="add-node"]');
  await page.click('[data-testid="node-http-request"]');
  await page.waitForTimeout(3500);
  await expect(page.locator("text=Saved")).toBeVisible();
});
```

---

## Troubleshooting

### **Auto-save not triggering**

- Check: `hasUnsavedChanges` state in React DevTools
- Verify: Hash comparison logic in `generateWorkflowHash`
- Ensure: Timer cleanup in `useEffect` dependencies

### **Undo/Redo not working**

- Check: `history` array length in React DevTools
- Verify: LocalStorage quota not exceeded
- Ensure: `isApplyingHistory` flag resets after state restore

### **Import validation failing**

- Check: JSON structure matches `WorkflowGraph` type
- Verify: All node types exist in `node-registry.ts`
- Ensure: Positions are valid numbers (not strings)

---

## Next Steps

1. **Add network status detection** - Offline queue with IndexedDB
2. **Implement conflict resolution** - 3-way merge dialog for concurrent edits
3. **Build template library** - Pre-built workflows (email automation, data scraping)

---

## Contributors

- **Muhammad Aliyan** - Lead Engineer (@MuhammadAliyan10)
- **Horizen AI Team** - Architecture & Design

---

## License

Proprietary - © 2025 Horizen AI. All rights reserved.
