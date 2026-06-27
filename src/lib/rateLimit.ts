/**
 * Client-side generation counter.
 * 
 * Uses localStorage so the count persists across page refreshes.
 * In production, enforce limits server-side per user account — 
 * this is only a UX convenience layer.
 */

const KEY = "outreachai_gen_count";
const FREE_LIMIT = 5;

export function getUsedCount(): number {
  try {
    return parseInt(localStorage.getItem(KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function incrementUsedCount(): number {
  const next = getUsedCount() + 1;
  try {
    localStorage.setItem(KEY, String(next));
  } catch { /* storage blocked */ }
  return next;
}

export function getRemainingCount(): number {
  return Math.max(0, FREE_LIMIT - getUsedCount());
}

export function hasReachedLimit(): boolean {
  return getUsedCount() >= FREE_LIMIT;
}

export { FREE_LIMIT };
