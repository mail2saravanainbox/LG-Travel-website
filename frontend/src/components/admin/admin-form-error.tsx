"use client";

import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

/**
 * Prominent, accessible error banner for admin forms. Scrolls itself into view
 * when a message appears so a failed save can never be missed (previously errors
 * rendered as a small line that was easy to overlook, or not at all).
 */
export function AdminFormError({ message }: { message: string | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600"
    >
      <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
