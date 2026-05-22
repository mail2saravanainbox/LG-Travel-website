import { ArrowRight } from "lucide-react";
import { fetchPackages } from "@/services/packages.service";
import { SectionHeading } from "@/components/shared/section-heading";
import { PackageCard } from "@/components/shared/package-card";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export async function PopularPackages() {
  const featuredPackages = await fetchPackages({ featured: true });
  return (
    <section className="container-lux py-20 md:py-28">
      <SectionHeading
        eyebrow="Signature Journeys"
        title="Our most-loved tour packages"
        description="Thoughtfully designed end-to-end. Book as-is or use them as the canvas for something bespoke."
      />

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPackages.map((pkg) => (
          <Reveal key={pkg.id}>
            <PackageCard pkg={pkg} />
          </Reveal>
        ))}
      </RevealGroup>

      <Reveal className="mt-12 flex justify-center">
        <Button href="/packages" variant="primary" size="lg">
          Explore all packages <ArrowRight className="h-5 w-5" />
        </Button>
      </Reveal>
    </section>
  );
}
