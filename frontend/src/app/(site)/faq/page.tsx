import type { Metadata } from "next";
import { faqs } from "@/data/faq";
import { PageHeader } from "@/components/shared/page-header";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about booking, payments, policies and support at LG Travels.",
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="Help centre"
        title="Frequently asked questions"
        description="Everything you need to know before you book. Can't find an answer? We're a message away."
        image="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "FAQ" }]}
      />

      <section className="container-lux grid gap-12 py-16 md:py-24 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="font-display text-xl font-bold text-navy-900">{cat}</h2>
              <div className="mt-2">
                <Accordion items={faqs.filter((f) => f.category === cat)} />
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl bg-navy-900 p-8 text-white">
            <h3 className="font-display text-xl font-bold">Still have questions?</h3>
            <p className="mt-3 text-sm text-white/70">
              Our travel designers are available around the clock to help you plan with confidence.
            </p>
            <Button href="/contact" variant="gold" size="lg" className="mt-6 w-full">
              Contact us
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
