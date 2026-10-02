/** Dev-only: preview UI states via `?dev=empty|error|filled` (stripped in production). */
export type AccountDevPreview = "empty" | "error" | "filled";

export function parseAccountDevPreview(
  searchParams: URLSearchParams
): AccountDevPreview | null {
  if (process.env.NODE_ENV !== "development") return null;
  const dev = searchParams.get("dev");
  if (dev === "empty" || dev === "error" || dev === "filled") return dev;
  return null;
}
