import type { TourPackage } from "@/types";
import { apiGet } from "./api";
import { mapPackage } from "./mappers";
import { packages as mockPackages } from "@/data/packages";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchPackages(
  params: { category?: string; featured?: boolean; sort?: string } = {},
): Promise<TourPackage[]> {
  try {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.featured) qs.set("featured", "true");
    if (params.sort) qs.set("sort", params.sort);
    const query = qs.toString() ? `?${qs}` : "";
    const data = await apiGet<any[]>(`/packages${query}`);
    return data.map(mapPackage);
  } catch (e) {
    console.warn("[packages] falling back to sample data:", (e as Error).message);
    return params.featured ? mockPackages.filter((p) => p.featured) : mockPackages;
  }
}

export async function fetchPackage(slug: string): Promise<TourPackage | null> {
  try {
    return mapPackage(await apiGet<any>(`/packages/${slug}`));
  } catch {
    return mockPackages.find((p) => p.slug === slug) ?? null;
  }
}

export async function fetchRelatedPackages(slug: string): Promise<TourPackage[]> {
  try {
    const data = await apiGet<any[]>(`/packages/${slug}/related`);
    return data.map(mapPackage);
  } catch {
    const current = mockPackages.find((p) => p.slug === slug);
    return mockPackages
      .filter((p) => p.slug !== slug && p.category === current?.category)
      .slice(0, 3);
  }
}

export async function fetchPackageSlugs(): Promise<string[]> {
  try {
    const data = await apiGet<any[]>("/packages");
    return data.map((p) => p.slug);
  } catch {
    return mockPackages.map((p) => p.slug);
  }
}
