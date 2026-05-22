import type { Metadata } from "next";
import { fetchDestinations } from "@/services/destinations.service";
import { PageHeader } from "@/components/shared/page-header";
import { DestinationsGrid } from "@/components/destinations/destinations-grid";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore LG Travels' curated collection of luxury destinations — from the Maldives to the Swiss Alps, Dubai to Kyoto.",
};

export default async function DestinationsPage() {
  const destinations = await fetchDestinations();
  return (
    <>
      <PageHeader
        eyebrow="Explore the world"
        title="Destinations worth crossing the world for"
        description="Hand-selected places, each with itineraries designed by specialists who know them intimately."
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Destinations" }]}
      />
      <section className="container-lux py-16 md:py-24">
        <DestinationsGrid destinations={destinations} />
      </section>
    </>
  );
}
