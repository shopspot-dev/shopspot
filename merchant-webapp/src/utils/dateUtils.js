import { format, parseISO } from 'date-fns';

export function formatDate(dateString) {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

export function formatTime(dateString) {
  return format(parseISO(dateString), 'hh:mm a');
}

export function formatDateTime(dateString) {
  return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
}