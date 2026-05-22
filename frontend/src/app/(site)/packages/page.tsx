import type { Metadata } from "next";
import { fetchPackages } from "@/services/packages.service";
import { PageHeader } from "@/components/shared/page-header";
import { PackagesExplorer } from "@/components/packages/packages-explorer";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Browse LG Travels' signature luxury tour packages — honeymoons, adventures, wellness retreats and bespoke journeys worldwide.",
};

export default async function PackagesPage() {
  const packages = await fetchPackages();
  return (
    <>
      <PageHeader
        eyebrow="Signature journeys"
        title="Tour packages, designed end-to-end"
        description="Book a ready-made escape or use it as the starting point for something entirely your own."
        image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Packages" }]}
      />
      <section className="container-lux py-16 md:py-24">
        <PackagesExplorer packages={packages} />
      </section>
    </>
  );
}
