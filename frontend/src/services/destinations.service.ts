import type { Destination, TourPackage } from "@/types";
import { apiGet } from "./api";
import { mapDestination, mapPackage } from "./mappers";
import { destinations as mockDestinations } from "@/data/destinations";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchDestinations(
  params: { featured?: boolean; continent?: string } = {},
): Promise<Destination[]> {
  try {
    const qs = new URLSearchParams();
    if (params.featured) qs.set("featured", "true");
    if (params.continent) qs.set("continent", params.continent);
    const query = qs.toString() ? `?${qs}` : "";
    const data = await apiGet<any[]>(`/destinations${query}`);
    return data.map(mapDestination);
  } catch (e) {
    console.warn("[destinations] falling back to sample data:", (e as Error).message);
    return params.featured ? mockDestinations.filter((d) => d.featured) : mockDestinations;
  }
}

export async function fetchDestinationDetail(
  slug: string,
): Promise<{ destination: Destination | null; packages: TourPackage[] }> {
  try {
    const d = await apiGet<any>(`/destinations/${slug}`);
    return {
      destination: mapDestination(d),
      packages: Array.isArray(d.packages)
        ? d.packages.map((p: any) => mapPackage({ ...p, destination: { slug: d.slug } }))
        : [],
    };
  } catch {
    const destination = mockDestinations.find((d) => d.slug === slug) ?? null;
    const { getPackagesByDestination } = await import("@/data/packages");
    return { destination, packages: destination ? getPackagesByDestination(slug) : [] };
  }
}

export async function fetchDestinationSlugs(): Promise<string[]> {
  try {
    const data = await apiGet<any[]>("/destinations");
    return data.map((d) => d.slug);
  } catch {
    return mockDestinations.map((d) => d.slug);
  }
}
