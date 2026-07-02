"use client";

import { Fragment, useState } from "react";
import { ChevronDown, Loader2, Pencil } from "lucide-react";
import {
  adminUpdateBooking,
  type AdminBooking,
  type BookingStatus,
} from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed", "refunded"];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-navy-100 text-navy-700",
  refunded: "bg-gray-100 text-gray-600",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        STATUS_COLOR[status] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {status}
    </span>
  );
}

export function BookingsTable({
  bookings,
  onUpdated,
}: {
  bookings: AdminBooking[];
  onUpdated: (b: AdminBooking) => void;
}) {
  const token = useAdmin((s) => s.token);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<BookingStatus>("pending");
  const [editingNotes, setEditingNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleRow(b: AdminBooking) {
    if (openRow === b.reference) {
      setOpenRow(null);
      return;
    }
    setOpenRow(b.reference);
    setEditingStatus(b.status as BookingStatus);
    setEditingNotes(b.notes ?? "");
    setError(null);
  }

  async function save(reference: string) {
    if (!token) {
      window.alert("Your session has expired — please sign in again.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await adminUpdateBooking(token, reference, {
        status: editingStatus,
        notes: editingNotes,
      });
      onUpdated(updated);
      setOpenRow(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (bookings.length === 0) {
    return <p className="p-10 text-center text-ink/50">No bookings yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-700/10 bg-mist/60 text-xs uppercase tracking-wide text-ink/50">
            {["Reference", "Package", "Guest", "Travellers", "Total", "Status", "Date", ""].map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <Fragment key={b.id}>
              <tr className="border-b border-navy-700/5 hover:bg-mist/40">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-navy-800">{b.reference}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">{b.package?.title ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {b.leadName} <span className="text-ink/40">· {b.leadEmail}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">{b.travelers}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {formatCurrency(Number(b.total), b.currency)}
                </td>
                <td className="whitespace-nowrap px-4 py-3"><StatusPill status={b.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/60">{formatDate(b.createdAt)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    onClick={() => toggleRow(b)}
                    className="inline-flex items-center gap-1 rounded-lg border border-navy-700/15 px-2.5 py-1 text-xs font-medium text-navy-700 hover:border-navy-700/40"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openRow === b.reference && "rotate-180")} />
                  </button>
                </td>
              </tr>
              {openRow === b.reference && (
                <tr className="bg-mist/40">
                  <td colSpan={8} className="px-4 py-4">
                    <div className="grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-start">
                      <div>
                        <label className="block text-xs font-medium text-navy-800">Status</label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value as BookingStatus)}
                          className="mt-1 w-full rounded-lg border border-navy-700/15 bg-white px-3 py-2 text-sm capitalize"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-navy-800">Internal notes</label>
                        <textarea
                          rows={2}
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-navy-700/15 bg-white px-3 py-2 text-sm"
                          placeholder="Phoned guest, hold for payment confirmation…"
                        />
                      </div>
                      <button
                        onClick={() => save(b.reference)}
                        disabled={saving}
                        className="self-end rounded-full bg-navy-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </button>
                    </div>
                    {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
