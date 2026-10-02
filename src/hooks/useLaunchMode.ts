import { useSyncExternalStore } from "react";

const LAUNCH_MODE = process.env.NEXT_PUBLIC_LAUNCH_MODE || "prelaunch";
const BYPASS_COOKIE = "ss_bypass_ui";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function getSnapshot(): boolean {
  if (LAUNCH_MODE === "live") return true;
  return getCookie(BYPASS_COOKIE) === "1";
}

function getServerSnapshot(): boolean {
  return LAUNCH_MODE === "live";
}

function subscribe(callback: () => void): () => void {
  // Re-check on visibility change (tab focus) in case cookie was set in another tab
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/**
 * Returns true when the app should show full "live" UI (not prelaunch gated).
 * Live when: NEXT_PUBLIC_LAUNCH_MODE=live OR ss_bypass_ui cookie is set.
 */
export function useLaunchMode() {
  const isLive = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    isLive,
    isPrelaunch: !isLive,
  };
}
