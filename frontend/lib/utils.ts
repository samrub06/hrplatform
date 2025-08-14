import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple utility functions

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR');
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('fr-FR');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
