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
    };
  } catch {
    return DEFAULTS;
  }
}
