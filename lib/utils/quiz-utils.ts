/**
 * Format estimated time for quiz display
 * Handles various input formats: "5", "5 min", "5 mins", "5 minutes", "10-15", "10-15 min"
 */
export function formatEstimatedTime(time: string | number): string {
  if (!time) return "N/A";

  const timeStr = String(time).trim();

  // If it already contains "min" or "minute", return as is
  if (
    timeStr.toLowerCase().includes("min") ||
    timeStr.toLowerCase().includes("hour")
  ) {
    return timeStr;
  }

  // Extract numbers (handles ranges like "10-15")
  const numbers = timeStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) {
    return timeStr;
  }

  // If it's a range (e.g., "10-15")
  if (timeStr.includes("-") && numbers.length >= 2) {
    return `${numbers[0]}-${numbers[1]} min`;
  }

  // Single number
  const num = parseInt(numbers[0]);
  if (num === 1) {
    return "1 min";
  }
  return `${num} min`;
}
