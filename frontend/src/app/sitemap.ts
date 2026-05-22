import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes = [
    "",
    "/about",
    "/destinations",
    "/packages",
    "/contact",
    "/blog",
    "/testimonials",
    "/faq",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const dynamicRoutes = [
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...packages.map((p) => `/packages/${p.slug}`),
    ...blogPosts.map((b) => `/blog/${b.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
