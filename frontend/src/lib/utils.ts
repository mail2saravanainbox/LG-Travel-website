import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a localized currency string. INR uses Indian grouping. */
export function formatCurrency(
  amount: number,
  currency: string = "INR",
  locale?: string,
) {
  // Guard against undefined/NaN from bad API data so cards never render "₹NaN".
  if (!Number.isFinite(amount)) return "—";
  const resolvedLocale = locale ?? (currency === "INR" ? "en-IN" : "en-US");
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string into a readable label. */
export function formatDate(date: string | Date, locale: string = "en-US") {
  const d = new Date(date);
  // Guard against missing/malformed dates so the UI never shows "Invalid Date".
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Format a phone field for display with an Indian ISD code. Handles one or more
 * comma-separated numbers and prefixes "+91 " to any that lack a country code,
 * so an already-prefixed number is never doubled.
 */
export function formatPhone(raw: string) {
  return raw
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => (n.startsWith("+") ? n : `+91 ${n}`))
    .join(", ");
}

/**
 * Normalise an address for display: collapse stray whitespace and push the final
 * comma-separated segment (e.g. "Guwahati – 781001") onto its own line. Render
 * the result with the `whitespace-pre-line` class so the newline shows.
 */
export function formatAddress(raw: string) {
  const clean = raw.replace(/\s+/g, " ").trim();
  const lastComma = clean.lastIndexOf(",");
  if (lastComma === -1) return clean;
  return `${clean.slice(0, lastComma).trim()}\n${clean.slice(lastComma + 1).trim()}`;
}

/** Build a URL-safe slug from arbitrary text. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
