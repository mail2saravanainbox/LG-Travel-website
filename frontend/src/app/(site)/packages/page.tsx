import type { Metadata } from "next";
import { fetchPackages } from "@/services/packages.service";
import { fetchSiteSettings } from "@/services/settings.service";
import { PageHeader } from "@/components/shared/page-header";
import { PackagesTabs } from "@/components/packages/packages-tabs";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Browse LG Travels' signature luxury tour packages — honeymoons, adventures, wellness retreats and bespoke journeys worldwide.",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const [{ search, type }, [packages, site]] = await Promise.all([
    searchParams,
    Promise.all([fetchPackages(), fetchSiteSettings()]),
  ]);
  const international = packages.filter((p) => p.tripType !== "domestic");
  const domestic = packages.filter((p) => p.tripType === "domestic");

  // Hero changes with the selected tab (International vs Domestic).
  const isDomestic = type === "domestic";
  const hero = isDomestic
    ? {
        eyebrow: "Explore India",
        title: "Domestic journeys, closer to home",
        description:
          "Discover the beauty of India — backwaters, palaces, mountains and beaches, designed end-to-end.",
        image:
          "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=2000&q=80&auto=format&fit=crop",
      }
    : {
        eyebrow: "Signature journeys",
        title: "Tour packages, designed end-to-end",
        description:
          "Book a ready-made escape or use it as the starting point for something entirely your own.",
        image:
          "https://res.cloudinary.com/dzevugvgg/image/upload/v1779640599/lg-travels/site/images/1501785888041-af3ef285b470.jpg",
      };

  return (
    <>
      <PageHeader
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        crumbs={[{ label: "Packages" }]}
      />

      <section className="container-lux py-16 md:py-24">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
            — Signature journeys
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 md:text-4xl">
            Browse our packages
          </h2>
        </div>
        <PackagesTabs
          international={international}
          domestic={domestic}
          internationalEnabled={site.internationalEnabled}
          initialSearch={search}
          initialTab={type}
        />
      </section>
    </>
  );
}
