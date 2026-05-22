import type { BlogPost } from "@/types";
import { apiGet } from "./api";
import { mapBlogPost } from "./mappers";
import { blogPosts as mockPosts } from "@/data/blog";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await apiGet<any[]>("/blog");
    // If the API has no posts yet, fall back to samples so the page isn't empty.
    return data.length ? data.map(mapBlogPost) : mockPosts;
  } catch (e) {
    console.warn("[blog] falling back to sample data:", (e as Error).message);
    return mockPosts;
  }
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return mapBlogPost(await apiGet<any>(`/blog/${slug}`));
  } catch {
    return mockPosts.find((p) => p.slug === slug) ?? null;
  }
}

export async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const data = await apiGet<any[]>("/blog");
    return data.length ? data.map((p) => p.slug) : mockPosts.map((p) => p.slug);
  } catch {
    return mockPosts.map((p) => p.slug);
  }
}
