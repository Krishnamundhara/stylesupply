"use client";

import { useEffect, useState } from "react";
import {
  parseAccountDevPreview,
  type AccountDevPreview,
} from "@/utils/accountDevPreview";

/** Reads `?dev=empty|error` once on mount. Production always returns ready + null preview. */
export function useAccountDevPreview() {
  const [preview, setPreview] = useState<AccountDevPreview | null>(null);
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(
      parseAccountDevPreview(new URLSearchParams(window.location.search))
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  return { preview, ready };
}
