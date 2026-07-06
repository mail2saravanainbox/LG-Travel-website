import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Check, MapPin, Star } from "lucide-react";
import { fetchDestinationDetail, fetchDestinationSlugs } from "@/services/destinations.service";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { PageHeader } from "@/components/shared/page-header";
import { PackageCard } from "@/components/shared/package-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export async function generateStaticParams() {
  return (await fetchDestinationSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { destination } = await fetchDestinationDetail(slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: destination.name,
    description: destination.description,
    openGraph: { images: [destination.heroImage] },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { destination, packages: relatedPackages } = await fetchDestinationDetail(slug);
  if (!destination) notFound();

  return (
    <>
      <PageHeader
        eyebrow={destination.continent}
        title={destination.name}
        description={destination.tagline}
        image={destination.heroImage}
        crumbs={[
          { label: "Destinations", href: "/destinations" },
          { label: destination.name },
        ]}
      />

      <section className="container-lux py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Overview"
              title={`Discover ${destination.name}`}
            />
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{destination.description}</p>

            <h3 className="mt-10 font-display text-xl font-semibold text-navy-900">Highlights</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {destination.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-ink/70">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                    <Check className="h-4 w-4" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {/* Gallery */}
            <div className="mt-10">
              <ImageCarousel
                images={[destination.heroImage, ...destination.gallery]}
                title={destination.name}
              />
            </div>
          </div>

          {/* Sticky info card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-navy-700/8 bg-white p-6 shadow-lift">
              <span className="text-sm text-ink/50">Trips from</span>
              <p className="font-display text-3xl font-bold text-navy-900">
                {formatCurrency(destination.startingPrice, destination.currency)}
              </p>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-ink/60">
                    <MapPin className="h-4 w-4 text-gold-500" /> Country
                  </dt>
                  <dd className="font-medium text-navy-800">{destination.country}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-ink/60">
                    <CalendarDays className="h-4 w-4 text-gold-500" /> Best season
                  </dt>
                  <dd className="font-medium text-navy-800">{destination.bestSeason}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-ink/60">
                    <Star className="h-4 w-4 text-gold-500" /> Rating
                  </dt>
                  <dd className="font-medium text-navy-800">
                    {destination.rating} ({destination.reviewCount})
                  </dd>
                </div>
              </dl>
              {relatedPackages.length > 0 && (
                <Button href="#destination-packages" variant="gold" size="lg" className="mt-6 w-full">
                  View packages
                </Button>
              )}
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className={`w-full ${relatedPackages.length > 0 ? "mt-3" : "mt-6"}`}
              >
                Plan a bespoke trip
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {relatedPackages.length > 0 && (
        <section id="destination-packages" className="scroll-mt-24 bg-mist py-16 md:py-24">
          <div className="container-lux">
            <SectionHeading
              eyebrow="Curated trips"
              title={`Packages in ${destination.name}`}
            />
            <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPackages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
