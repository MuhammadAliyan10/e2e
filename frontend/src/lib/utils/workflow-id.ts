/**
 * Generate a temporary workflow ID for unsaved workflows
 * Format: wf_timestamp_random
 */
export function generateWorkflowId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `wf_${timestamp}_${random}`;
}

/**
 * Check if a workflow ID is temporary (not yet saved to DB)
 */
export function isTemporaryWorkflowId(id: string): boolean {
  return id.startsWith("wf_") && id.split("_").length === 3;
}

/**
 * Validate workflow ID format
 */
export function isValidWorkflowId(id: string): boolean {
  // Either a UUID (from DB) or temporary format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const tempRegex = /^wf_\d+_[a-z0-9]+$/;

  return uuidRegex.test(id) || tempRegex.test(id);
}
