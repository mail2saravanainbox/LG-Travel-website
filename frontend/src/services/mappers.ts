/**
 * Map raw API/Prisma payloads onto the frontend domain types.
 * Handles Decimal→number coercion (Prisma serialises Decimal as string)
 * and field-name differences (isFeatured→featured, dayNumber→day, avatarUrl→avatar).
 */
import type { BlogPost, Destination, ItineraryDay, Testimonial, TourPackage } from "@/types";

const arr = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapItinerary(i: any): ItineraryDay {
  return {
    day: i.dayNumber,
    title: i.title,
    description: i.description ?? "",
    stay: i.stay ?? undefined,
    meals: arr<string>(i.meals),
  };
}

export function mapDestination(d: any): Destination {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    country: d.country,
    continent: d.continent,
    tagline: d.tagline ?? "",
    description: d.description ?? d.tagline ?? "",
    heroImage: d.heroImage,
    gallery: arr<string>(d.gallery),
    startingPrice: Number(d.startingPrice),
    currency: d.currency ?? "INR",
    rating: Number(d.rating),
    reviewCount: d.reviewCount ?? 0,
    bestSeason: d.bestSeason ?? "",
    highlights: arr<string>(d.highlights),
    featured: Boolean(d.isFeatured),
  };
}

export function mapPackage(p: any): TourPackage {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    destinationSlug: p.destination?.slug ?? "",
    location: p.location ?? "",
    summary: p.summary ?? "",
    description: p.description ?? p.summary ?? "",
    heroImage: p.heroImage,
    gallery: arr<string>(p.gallery),
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    price: Number(p.price),
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : undefined,
    currency: p.currency ?? "INR",
    rating: Number(p.rating),
    reviewCount: p.reviewCount ?? 0,
    groupSize: p.groupSize ?? "",
    category: p.category,
    tripType: (p.tripType ?? "international") as "international" | "domestic",
    highlights: arr<string>(p.highlights),
    inclusions: arr<string>(p.inclusions),
    exclusions: arr<string>(p.exclusions),
    itinerary: arr<any>(p.itinerary).map(mapItinerary),
    featured: Boolean(p.isFeatured),
    badge: p.badge ?? undefined,
  };
}

export function mapBlogPost(p: any): BlogPost {
  const author = p.author
    ? {
        name: p.author.fullName ?? "LG Travels",
        avatar: p.author.avatarUrl ?? "https://i.pravatar.cc/200?img=68",
        role: "Travel Writer",
      }
    : { name: "LG Travels Editorial", avatar: "https://i.pravatar.cc/200?img=68", role: "Travel Desk" };

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    content: p.content ?? "",
    cover: p.coverImage ?? FALLBACK_COVER,
    author,
    category: p.category ?? "Journal",
    readingTime: p.readingTime ?? 4,
    publishedAt: (p.publishedAt ?? p.createdAt ?? new Date().toISOString()).slice(0, 10),
    tags: arr<string>(p.tags),
  };
}

export function mapTestimonial(t: any): Testimonial {
  return {
    id: t.id,
    name: t.name,
    location: t.location ?? "",
    avatar: t.avatarUrl,
    rating: t.rating,
    quote: t.quote,
    trip: t.trip ?? "",
  };
}
