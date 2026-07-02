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

/** Build a URL-safe slug from arbitrary text. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
