import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal, RevealGroup } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real stories from LG Travels guests around the world.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Loved worldwide"
        title="What our travellers say"
        description="Thousands of journeys, one consistent promise — kept."
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640599/lg-travels/site/images/1530789253388-582c481c54b0.jpg"
        crumbs={[{ label: "Testimonials" }]}
      />

      <section className="container-lux py-16 md:py-24">
        <RevealGroup className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t) => (
            <Reveal key={t.id}>
              <figure className="break-inside-avoid rounded-3xl border border-navy-700/8 bg-white p-7 shadow-soft">
                <Quote className="h-8 w-8 text-gold-400" />
                <blockquote className="mt-4 leading-relaxed text-ink/75">“{t.quote}”</blockquote>
                <div className="mt-5 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-700/8 pt-5">
                  <Image src={t.avatar} alt={t.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-ink/50">{t.location} · {t.trip}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
