import type { Testimonial } from "@/types";
import { apiGet } from "./api";
import { mapTestimonial } from "./mappers";
import { testimonials as mockTestimonials } from "@/data/testimonials";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchTestimonials({ allowMock = true } = {}): Promise<Testimonial[]> {
  try {
    const data = await apiGet<any[]>("/testimonials");
    if (data.length) return data.map(mapTestimonial);
    // Admin panel passes allowMock:false so it never lists un-editable sample rows.
    return allowMock ? mockTestimonials : [];
  } catch (e) {
    console.warn("[testimonials] falling back to sample data:", (e as Error).message);
    return allowMock ? mockTestimonials : [];
  }
}
