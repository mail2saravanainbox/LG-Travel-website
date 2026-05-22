/**
 * Thin fetch wrapper for the LG Travels NestJS API.
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.local).
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

/** GET a JSON resource. Server components revalidate every 30s. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return (await res.json()) as T;
}

/** POST JSON and return the created resource. Pass a Clerk token for protected routes. */
export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const msg = Array.isArray(data?.message) ? data?.message.join(", ") : data?.message;
    throw new Error(msg ?? `POST ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}

/** PATCH JSON (partial update). Pass a token for protected routes. */
export async function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const msg = Array.isArray(data?.message) ? data?.message.join(", ") : data?.message;
    throw new Error(msg ?? `PATCH ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}

/** DELETE a resource. Pass a token for protected routes. */
export async function apiDelete<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const msg = Array.isArray(data?.message) ? data?.message.join(", ") : data?.message;
    throw new Error(msg ?? `DELETE ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}
