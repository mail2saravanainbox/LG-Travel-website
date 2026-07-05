import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  cancelled: "bg-rose-50 text-rose-600 ring-rose-600/20",
  refunded: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

/** Small pill that colour-codes a booking or payment status. */
export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STYLES[key] ?? "bg-navy-50 text-navy-700 ring-navy-600/20",
      )}
    >
      {label}
    </span>
  );
}
