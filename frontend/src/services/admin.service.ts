import { API_BASE, apiDelete, apiPatch, apiPost } from "./api";

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

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

/** Fetch a one-time signature for a signed direct-to-Cloudinary upload. */
export const getCloudinarySignature = (token: string, folder = "lg-travels") =>
  authGet<CloudinarySignature>(
    `/admin/cloudinary/signature?folder=${encodeURIComponent(folder)}`,
    token,
  );

/**
 * Upload one image to Cloudinary via a signed request.
 * Returns the hosted URL + public ID. The API secret never reaches the browser.
 */
export async function uploadImage(
  token: string,
  file: File,
  folder = "lg-travels/packages",
): Promise<{ url: string; publicId: string }> {
  const sig = await getCloudinarySignature(token, folder);
  if (!sig.cloudName || !sig.apiKey) {
    throw new Error("Cloudinary is not configured on the server.");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error?.message ?? `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}

export interface ItineraryDayInput {
  dayNumber: number;
  title: string;
  description?: string;
  stay?: string;
}

export interface NewPackageInput {
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  location?: string;
  heroImage?: string;
  gallery?: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  oldPrice?: number;
  currency?: string;
  groupSize?: string;
  category?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  badge?: string;
  isFeatured?: boolean;
  destinationSlug?: string;
  itinerary?: ItineraryDayInput[];
}

/** Create a package (admin-only). Returns the created package with its slug. */
export const adminCreatePackage = (token: string, payload: NewPackageInput) =>
  apiPost<{ id: string; slug: string; title: string }>("/packages", payload, token);

/** Update an existing package by slug (admin-only). All fields optional. */
export const adminUpdatePackage = (
  token: string,
  slug: string,
  payload: Partial<NewPackageInput> & { isActive?: boolean },
) =>
  apiPatch<{ id: string; slug: string; title: string }>(
    `/packages/${slug}`,
    payload,
    token,
  );

/** Delete a package by slug (admin-only). Refused by the API if it has bookings. */
export const adminDeletePackage = (token: string, slug: string) =>
  apiDelete<{ deleted: boolean; slug: string }>(`/packages/${slug}`, token);

export interface NewBlogInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  readingTime?: number;
  tags?: string[];
  published?: boolean;
}

/** Create a blog post (admin-only). Published by default. */
export const adminCreateBlogPost = (token: string, payload: NewBlogInput) =>
  apiPost<{ id: string; slug: string; title: string }>("/blog", payload, token);

/** Update a blog post by slug (admin-only). */
export const adminUpdateBlogPost = (
  token: string,
  slug: string,
  payload: Partial<NewBlogInput>,
) => apiPatch<{ id: string; slug: string; title: string }>(`/blog/${slug}`, payload, token);

/** Delete a blog post by slug (admin-only). */
export const adminDeleteBlogPost = (token: string, slug: string) =>
  apiDelete<{ deleted: boolean; slug: string }>(`/blog/${slug}`, token);

export interface NewDestinationInput {
  name: string;
  slug?: string;
  country: string;
  continent: string;
  tagline?: string;
  description?: string;
  heroImage?: string;
  gallery?: string[];
  startingPrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  bestSeason?: string;
  highlights?: string[];
  isFeatured?: boolean;
}

/** Create a destination (admin-only). */
export const adminCreateDestination = (token: string, payload: NewDestinationInput) =>
  apiPost<{ id: string; slug: string; name: string }>("/destinations", payload, token);

/** Update a destination by slug (admin-only). */
export const adminUpdateDestination = (
  token: string,
  slug: string,
  payload: Partial<NewDestinationInput>,
) =>
  apiPatch<{ id: string; slug: string; name: string }>(`/destinations/${slug}`, payload, token);

/** Delete a destination by slug (admin-only). Refused by the API if it has linked packages. */
export const adminDeleteDestination = (token: string, slug: string) =>
  apiDelete<{ deleted: boolean; slug: string }>(`/destinations/${slug}`, token);
