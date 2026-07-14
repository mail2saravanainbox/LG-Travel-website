import { apiGet } from "./api";
import { SITE } from "@/constants/site";

/** All admin-editable site fields (everything in SITE except `url` and `ogImage`). */
export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  hours: string;
  addressLabel: string;
  address: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  /** When false, the public Packages page hides the International section. */
  internationalEnabled: boolean;
  /** Editable text in the homepage hero's floating cards. */
  hero: {
    designerEyebrow: string;
    designerTitle: string;
    trendingEyebrow: string;
    trendingBadge: string;
    trendingTitle: string;
    trendingSubtitle: string;
    trendingPrice: string;
    trendingRating: string;
  };
  /** The four numbers shown in the stats band on the About page. */
  aboutStats: { value: string; label: string }[];
}

/** Plain-object snapshot of the SITE constant, used as the fallback. */
const DEFAULTS: SiteSettings = {
  name: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  email: SITE.email,
  phone: SITE.phone,
  hours: SITE.hours,
  addressLabel: SITE.addressLabel,
  address: SITE.address,
  social: { ...SITE.social },
  internationalEnabled: true,
  hero: {
    designerEyebrow: "Your designer is online",
    designerTitle: "Plan a bespoke trip in minutes",
    trendingEyebrow: "Trending now",
    trendingBadge: "-14%",
    trendingTitle: "Maldives Overwater Escape",
    trendingSubtitle: "6 days · Private villa · Seaplane",
    trendingPrice: "₹3,48,600",
    trendingRating: "4.9",
  },
  aboutStats: [
    { value: "120+", label: "Destinations" },
    { value: "18k+", label: "Journeys crafted" },
    { value: "4.9/5", label: "Average rating" },
    { value: "24/7", label: "Concierge care" },
  ],
};

/**
 * Fetch the site settings from the API and merge with hardcoded defaults
 * so missing keys never break the UI. Returns DEFAULTS on any error.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await apiGet<Partial<SiteSettings> | null>("/settings/site");
    if (!data) return DEFAULTS;
    return {
      ...DEFAULTS,
      ...data,
      social: { ...DEFAULTS.social, ...(data.social ?? {}) },
      hero: { ...DEFAULTS.hero, ...(data.hero ?? {}) },
      aboutStats:
        Array.isArray(data.aboutStats) && data.aboutStats.length
          ? data.aboutStats
          : DEFAULTS.aboutStats,
    };
  } catch {
    return DEFAULTS;
  }
}
