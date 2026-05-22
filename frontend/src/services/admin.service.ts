import { API_BASE, apiPost } from "./api";

export interface AdminStats {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalLeads: number;
  totalPackages: number;
  totalDestinations: number;
}

export interface AdminBooking {
  id: string;
  reference: string;
  leadName: string;
  leadEmail: string;
  travelers: number;
  total: string;
  currency: string;
  status: string;
  createdAt: string;
  package?: { title: string } | null;
}

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  destination?: string | null;
  budget?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

/** Admin login → returns a session token. */
export function adminLogin(username: string, password: string) {
  return apiPost<{ token: string; user: { username: string } }>("/admin/login", {
    username,
    password,
  });
}

/** Authenticated GET against an admin endpoint. */
async function authGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export const getAdminStats = (t: string) => authGet<AdminStats>("/admin/stats", t);
export const getAdminBookings = (t: string) => authGet<AdminBooking[]>("/admin/bookings", t);
export const getAdminLeads = (t: string) => authGet<AdminLead[]>("/admin/inquiries", t);
