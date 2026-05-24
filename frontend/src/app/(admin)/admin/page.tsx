"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CalendarCheck,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
} from "lucide-react";
import {
  getAdminBookings,
  getAdminLeads,
  getAdminStats,
  type AdminBooking,
  type AdminLead,
  type AdminStats,
} from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { PackagesPanel } from "@/components/admin/packages-panel";
import { BlogPanel } from "@/components/admin/blog-panel";
import { DestinationsPanel } from "@/components/admin/destinations-panel";
import { TestimonialsPanel } from "@/components/admin/testimonials-panel";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type Tab =
  | "bookings"
  | "leads"
  | "packages"
  | "destinations"
  | "blog"
  | "testimonials"
  | "media";

export default function AdminDashboard() {
  const router = useRouter();
  const { token, username, logout } = useAdmin();
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [tab, setTab] = useState<Tab>("bookings");

  // Guard + data load. Zustand persist hydrates after mount, so wait a tick.
  useEffect(() => {
    const t = useAdmin.getState().token;
    if (!t) {
      router.replace("/admin/login");
      return;
    }
    Promise.all([getAdminStats(t), getAdminBookings(t), getAdminLeads(t)])
      .then(([s, b, l]) => {
        setStats(s);
        setBookings(b);
        setLeads(l);
        setReady(true);
      })
      .catch(() => {
        logout();
        router.replace("/admin/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function signOut() {
    logout();
    router.replace("/admin/login");
  }

  if (!ready || !token) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist text-ink/50">Loading dashboard…</div>
    );
  }

  const cards = [
    { label: "Total bookings", value: String(stats?.totalBookings ?? 0), icon: CalendarCheck },
    { label: "Revenue", value: formatCurrency(stats?.totalRevenue ?? 0, "INR"), icon: IndianRupee },
    { label: "Leads", value: String(stats?.totalLeads ?? 0), icon: MessageSquare },
    { label: "Packages", value: String(stats?.totalPackages ?? 0), icon: Package },
  ];

  return (
    <div className="min-h-screen bg-mist">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-navy-700/10 bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Image src="/logo-white.png" alt="LG Travels" width={416} height={275} className="h-10 w-auto" />
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-gold-300 sm:flex">
              <LayoutDashboard className="h-3.5 w-3.5" /> Admin
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/60">Hi, {username}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-white/80 transition-colors hover:border-rose-300 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">Dashboard</h1>

        {/* Stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-navy-700/8 bg-white p-5 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-700">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-2xl font-bold text-navy-900">{value}</p>
              <p className="text-sm text-ink/50">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2">
          {(["bookings", "leads", "packages", "destinations", "blog", "testimonials", "media"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-all",
                tab === t
                  ? "bg-navy-700 text-white shadow-soft"
                  : "border border-navy-700/15 text-navy-700 hover:border-navy-700/40",
              )}
            >
              {t === "bookings"
                ? `bookings (${bookings.length})`
                : t === "leads"
                  ? `leads (${leads.length})`
                  : t}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === "packages" ? (
          <div className="mt-4">
            <PackagesPanel />
          </div>
        ) : tab === "destinations" ? (
          <div className="mt-4">
            <DestinationsPanel />
          </div>
        ) : tab === "blog" ? (
          <div className="mt-4">
            <BlogPanel />
          </div>
        ) : tab === "testimonials" ? (
          <div className="mt-4">
            <TestimonialsPanel />
          </div>
        ) : tab === "media" ? (
          <div className="mt-4">
            <ImageUploader />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-soft">
            {tab === "bookings" ? (
              <Table
                head={["Reference", "Package", "Guest", "Travellers", "Total", "Status", "Date"]}
                rows={bookings.map((b) => [
                  b.reference,
                  b.package?.title ?? "—",
                  `${b.leadName} · ${b.leadEmail}`,
                  String(b.travelers),
                  formatCurrency(Number(b.total), b.currency),
                  <StatusPill key={b.id} status={b.status} />,
                  formatDate(b.createdAt),
                ])}
                empty="No bookings yet."
              />
            ) : (
              <Table
                head={["Name", "Email", "Phone", "Destination", "Budget", "Message", "Date"]}
                rows={leads.map((l) => [
                  l.name,
                  l.email,
                  l.phone ?? "—",
                  l.destination ?? "—",
                  l.budget ?? "—",
                  <span key={l.id} className="line-clamp-2 max-w-xs text-ink/60">{l.message ?? "—"}</span>,
                  formatDate(l.createdAt),
                ])}
                empty="No leads yet."
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Table({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="p-10 text-center text-ink/50">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-700/10 bg-mist/60 text-xs uppercase tracking-wide text-ink/50">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-navy-700/5 last:border-0 hover:bg-mist/40">
              {cells.map((c, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-3 text-ink/80">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
    completed: "bg-navy-100 text-navy-700",
    refunded: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", map[status] ?? "bg-gray-100 text-gray-600")}>
      {status}
    </span>
  );
}
