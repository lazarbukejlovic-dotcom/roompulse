import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO, differenceInDays } from 'date-fns';

/**
 * Format a date string like "Apr 15" or "Apr 15, 2025"
 */
export function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  const now = new Date();
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d');
  }
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date as relative like "3 days ago" or "in 2 hours"
 */
export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a due date with context: "Today", "Tomorrow", "Apr 15", "Overdue"
 */
export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return formatShortDate(dateStr);
}


/**
 * Get urgency level for styling: 'overdue' | 'soon' | 'normal'
 */
export function getDueUrgency(dateStr: string | null): 'overdue' | 'soon' | 'normal' {
  if (!dateStr) return 'normal';
  const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  if (isPast(date) && !isToday(date)) return 'overdue';
  if (differenceInDays(date, new Date()) <= 2) return 'soon';
  return 'normal';
}
