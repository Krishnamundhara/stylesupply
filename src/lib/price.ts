/** Formats a minor-unit (paisa) integer as a rupee string, e.g. 5000000 → "₹50,000". */
export function formatRupees(minor: number): string {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}
