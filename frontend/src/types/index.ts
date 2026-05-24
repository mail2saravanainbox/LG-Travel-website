/** Shared domain types for the LG Travels platform. */

export type Continent =
  | "Asia"
  | "Europe"
  | "Middle East"
  | "Africa"
  | "Americas"
  | "Oceania";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  continent: Continent;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  startingPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  bestSeason: string;
  highlights: string[];
  featured?: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string[];
  stay?: string;
}

export type TripType = "international" | "domestic";

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  destinationSlug: string;
  location: string;
  summary: string;
  description: string;
  heroImage: string;
  gallery: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  oldPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  groupSize: string;
  category: PackageCategory;
  tripType?: TripType;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  featured?: boolean;
  badge?: string;
}

export type PackageCategory =
  | "Luxury"
  | "Honeymoon"
  | "Adventure"
  | "Family"
  | "Wellness"
  | "Cultural";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  trip: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: { name: string; avatar: string; role: string };
  category: string;
  readingTime: number;
  publishedAt: string;
  tags: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}
