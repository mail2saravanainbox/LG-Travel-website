import type { BlogPost } from "@/types";
import { apiGet } from "./api";
import { mapBlogPost } from "./mappers";
import { blogPosts as mockPosts } from "@/data/blog";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchBlogPosts({ allowMock = true } = {}): Promise<BlogPost[]> {
  try {
    const data = await apiGet<any[]>("/blog");
    // Public pages fall back to samples so the page isn't empty; the admin panel
    // passes allowMock:false so it never shows un-editable fake rows (deleting a
    // mock row would call the API with a fake id → 404).
    if (data.length) return data.map(mapBlogPost);
    return allowMock ? mockPosts : [];
  } catch (e) {
    console.warn("[blog] falling back to sample data:", (e as Error).message);
    return allowMock ? mockPosts : [];
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
