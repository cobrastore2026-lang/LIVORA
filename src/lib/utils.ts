import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "ر.ي"): string {
  if (isNaN(amount)) return `0 ${currency}`;
  return `${amount.toLocaleString('ar-YE')} ${currency}`;
}

export function formatPriceEn(amount: number): string {
  if (isNaN(amount)) return "0";
  return amount.toLocaleString('en-US');
}

/**
 * Normalizes Arabic text for flexible search (handles hamza variations, taa marbuta, etc.)
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىئ]/g, "ي")
    .replace(/[\u064B-\u065F]/g, "") // remove Tashkeel
    .toLowerCase()
    .trim();
}
