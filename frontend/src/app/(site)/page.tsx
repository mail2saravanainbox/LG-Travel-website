import { Hero } from "@/components/home/hero";
import { FeaturedDestinations } from "@/components/home/featured-destinations";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { PopularPackages } from "@/components/home/popular-packages";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Gallery } from "@/components/home/gallery";
import { Newsletter } from "@/components/home/newsletter";
import { SearchWidget } from "@/components/home/search-widget";
import { SITE } from "@/constants/site";
import { fetchSiteSettings } from "@/services/settings.service";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  telephone: `+91 ${SITE.phone.split(",")[0].trim()}`,
  address: { "@type": "PostalAddress", streetAddress: SITE.address },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "2300",
  },
};

export default async function HomePage() {
  const site = await fetchSiteSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        designerEyebrow={site.hero.designerEyebrow}
        designerTitle={site.hero.designerTitle}
        trendingEyebrow={site.hero.trendingEyebrow}
        trendingBadge={site.hero.trendingBadge}
        trendingTitle={site.hero.trendingTitle}
        trendingSubtitle={site.hero.trendingSubtitle}
        trendingPrice={site.hero.trendingPrice}
        trendingRating={site.hero.trendingRating}
      />

      {/* Mobile search widget (the hero copy is desktop-only) */}
      <div className="container-lux md:hidden">
        <div className="relative z-20 -translate-y-8">
          <SearchWidget />
        </div>
      </div>

      <FeaturedDestinations />
      <WhyChooseUs />
      <PopularPackages />
      <TestimonialsSection />
      <Gallery />
      <Newsletter />
    </>
  );
}
