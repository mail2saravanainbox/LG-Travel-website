import type { Testimonial } from "@/types";
import { apiGet } from "./api";
import { mapTestimonial } from "./mappers";
import { testimonials as mockTestimonials } from "@/data/testimonials";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await apiGet<any[]>("/testimonials");
    return data.length ? data.map(mapTestimonial) : mockTestimonials;
  } catch (e) {
    console.warn("[testimonials] falling back to sample data:", (e as Error).message);
    return mockTestimonials;
  }
}
