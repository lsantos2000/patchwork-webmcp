'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export type StorageStatus = 'loading' | 'saved' | 'unavailable';

export function usePersistentState<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>, boolean, StorageStatus] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('loading');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);
        // Hydration intentionally reconciles the client-only localStorage value after mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isValid(parsed)) setValue(parsed);
        else window.localStorage.removeItem(key);
      }
    } catch {
      // Storage access itself can be blocked; recovery must not throw again.
      try { window.localStorage.removeItem(key); } catch { /* Use in-memory state. */ }
    } finally {
      setHydrated(true);
    }
  }, [key, isValid]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageStatus('saved');
    } catch {
      setStorageStatus('unavailable');
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated, storageStatus];
}
