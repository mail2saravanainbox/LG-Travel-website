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

  return (
    <>
      <PageHeader
        eyebrow="Signature journeys"
        title="Tour packages, designed end-to-end"
        description="Book a ready-made escape or use it as the starting point for something entirely your own."
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640599/lg-travels/site/images/1501785888041-af3ef285b470.jpg"
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
