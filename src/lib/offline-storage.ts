/**
 * Offline storage utility for caching critical app data
 * Uses localStorage as a fallback when offline
 */

const STORAGE_KEYS = {
  CHILDREN: "fh_children",
  TASKS: "fh_tasks",
  LAST_SYNC: "fh_last_sync",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function getItem<T>(key: StorageKey): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
    console.warn("Failed to save to localStorage");
  }
}

function removeItem(key: StorageKey): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

// Public API
export const offlineStorage = {
  // Children
  getChildren: () => getItem<unknown[]>(STORAGE_KEYS.CHILDREN),
  setChildren: (children: unknown[]) =>
    setItem(STORAGE_KEYS.CHILDREN, children),

  // Tasks
  getTasks: () => getItem<unknown[]>(STORAGE_KEYS.TASKS),
  setTasks: (tasks: unknown[]) => setItem(STORAGE_KEYS.TASKS, tasks),

  // Last sync time
  getLastSync: () => getItem<number>(STORAGE_KEYS.LAST_SYNC),
  setLastSync: () => setItem(STORAGE_KEYS.LAST_SYNC, Date.now()),

  // Clear all
  clear: () => {
    removeItem(STORAGE_KEYS.CHILDREN);
    removeItem(STORAGE_KEYS.TASKS);
    removeItem(STORAGE_KEYS.LAST_SYNC);
  },
};
