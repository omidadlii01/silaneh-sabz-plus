import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../api';

// navigator.onLine only reflects whether the device has an active network
// interface (Wi-Fi/mobile data ON) — it stays `true` even with no real
// internet access (captive portal, airplane-mode-adjacent states, dead SIM
// data, etc). To know whether the app can actually reach our backend we
// periodically try a real, short-timeout request to it. This is what
// drives the full-screen offline overlay.
const PING_INTERVAL_MS = 4000;
const PING_TIMEOUT_MS = 3500;

async function canReachServer(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
    // /api/settings is a tiny, always-available public GET — good for a
    // lightweight reachability check without hitting real business logic.
    await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const checkingRef = useRef(false);
  const checkRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (checkingRef.current) return;
      checkingRef.current = true;
      const ok = await canReachServer();
      checkingRef.current = false;
      if (!cancelled) setIsOnline(ok);
    };
    checkRef.current = check;

    check();
    const interval = setInterval(check, PING_INTERVAL_MS);

    // Also react instantly to browser network events for a snappier feel —
    // the interval above is what actually confirms/clears the state.
    const onOnline = () => check();
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const recheckNow = () => checkRef.current();

  return { isOnline, recheckNow };
}
