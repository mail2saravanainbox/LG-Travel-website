import type { Metadata } from "next";
import { fetchPackages } from "@/services/packages.service";
import { fetchSiteSettings } from "@/services/settings.service";
import { PageHeader } from "@/components/shared/page-header";
import { PackagesExplorer } from "@/components/packages/packages-explorer";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Browse LG Travels' signature luxury tour packages — honeymoons, adventures, wellness retreats and bespoke journeys worldwide.",
};

export default async function PackagesPage() {
  const [packages, site] = await Promise.all([fetchPackages(), fetchSiteSettings()]);
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

      {site.internationalEnabled && international.length > 0 && (
        <section className="container-lux pt-16 md:pt-24">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
                — Across the world
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 md:text-4xl">
                International trips
              </h2>
              <p className="mt-2 max-w-2xl text-ink/65">
                Hand-crafted journeys to the planet&apos;s most extraordinary places.
              </p>
            </div>
            <span className="hidden text-sm text-ink/50 sm:block">
              {international.length} package{international.length === 1 ? "" : "s"}
            </span>
          </div>
          <PackagesExplorer packages={international} />
        </section>
      )}

      {domestic.length > 0 && (
        <section className="container-lux py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
                — Closer to home
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 md:text-4xl">
                Domestic trips
              </h2>
              <p className="mt-2 max-w-2xl text-ink/65">
                Discover the beauty of India — palaces, beaches, mountains and more.
              </p>
            </div>
            <span className="hidden text-sm text-ink/50 sm:block">
              {domestic.length} package{domestic.length === 1 ? "" : "s"}
            </span>
          </div>
          <PackagesExplorer packages={domestic} />
        </section>
      )}

      {/* Edge case: nothing to show */}
      {(!site.internationalEnabled || international.length === 0) && domestic.length === 0 && (
        <section className="container-lux py-24 text-center">
          <p className="text-ink/60">No packages to show yet — check back soon.</p>
        </section>
      )}
    </>
  );
}
