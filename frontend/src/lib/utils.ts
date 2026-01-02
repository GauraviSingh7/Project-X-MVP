import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time for US timezones
export function formatMatchTime(isoString: string, timezone: string = 'America/New_York'): string {
  const date = parseISO(isoString);
  return formatInTimeZone(date, timezone, 'MMM d, h:mm a zzz');
}

// Format relative time (e.g., "5 minutes ago")
export function formatRelativeTime(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
}

// Format date for schedule display
export function formatScheduleDate(isoString: string): string {
  return format(parseISO(isoString), 'EEEE, MMMM d, yyyy');
}

// Get status color class
export function getStatusClass(status: 'LIVE' | 'UPCOMING' | 'FINISHED'): string {
  switch (status) {
    case 'LIVE':
      return 'status-live';
    case 'UPCOMING':
      return 'status-upcoming';
    case 'FINISHED':
      return 'status-finished';
    default:
      return '';
  }
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Format large numbers (e.g., 1200 -> 1.2K)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
