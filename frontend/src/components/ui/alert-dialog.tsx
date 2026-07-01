"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Lightweight modal used to confirm an action succeeded (e.g. after saving).
 * Renders nothing when `open` is false. Clicking the backdrop or the button
 * both dismiss via `onAction`.
 */
export function AlertDialog({
  open,
  title,
  description,
  actionLabel = "OK",
  onAction,
}: {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] grid place-items-center bg-navy-900/40 p-4 backdrop-blur-sm"
      onClick={onAction}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{title}</h3>
        {description && <div className="mt-2 text-sm text-ink/60">{description}</div>}
        <Button variant="gold" className="mt-6 w-full" onClick={onAction} autoFocus>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
