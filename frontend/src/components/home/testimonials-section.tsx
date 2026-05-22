import { fetchTestimonials } from "@/services/testimonials.service";
import { TestimonialsSlider } from "./testimonials-slider";

/** Server wrapper: fetches testimonials and feeds the client slider. */
export async function TestimonialsSection() {
  const testimonials = await fetchTestimonials();
  return <TestimonialsSlider testimonials={testimonials} />;
}
