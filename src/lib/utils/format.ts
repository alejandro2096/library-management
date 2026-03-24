import { format, formatDistanceToNow, isAfter } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy", { locale: es });
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function isOverdue(dueDate: Date | string): boolean {
  return isAfter(new Date(), new Date(dueDate));
}

export function getDueDaysLeft(dueDate: Date | string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
