import { ArrowRight } from "lucide-react";
import { fetchDestinations } from "@/services/destinations.service";
import { SectionHeading } from "@/components/shared/section-heading";
import { DestinationCard } from "@/components/shared/destination-card";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export async function FeaturedDestinations() {
  const featuredDestinations = await fetchDestinations({ featured: true });
  return (
    <section className="container-lux py-20 md:py-28">
      <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
        <SectionHeading
          align="left"
          eyebrow="Handpicked Destinations"
          title="Where will your story begin?"
          description="From overwater villas to alpine summits — explore the destinations our travellers love most."
          className="md:max-w-xl"
        />
        <Reveal>
          <Button href="/destinations" variant="outline">
            View all destinations <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredDestinations.map((destination) => (
          <Reveal key={destination.id}>
            <DestinationCard destination={destination} />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
