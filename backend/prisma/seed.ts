import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const destinations = [
  { slug: "maldives", name: "Maldives", country: "Maldives", continent: "Asia", tagline: "Overwater villas & glass-clear lagoons", heroImage: img("photo-1514282401047-d79a71a590e8"), startingPrice: 199200, rating: 4.9, reviewCount: 412, bestSeason: "Nov – Apr", isFeatured: true, highlights: ["Overwater villas", "Private reef dives", "Sandbank dining"] },
  { slug: "switzerland", name: "Swiss Alps", country: "Switzerland", continent: "Europe", tagline: "Alpine peaks & glacier railways", heroImage: img("photo-1531366936337-7c912a4589a7"), startingPrice: 257300, rating: 4.8, reviewCount: 287, bestSeason: "Dec – Mar · Jun – Sep", isFeatured: true, highlights: ["Glacier Express", "Matterhorn views", "Alpine fine dining"] },
  { slug: "dubai", name: "Dubai", country: "United Arab Emirates", continent: "Middle East", tagline: "Desert glamour & skyline spectacle", heroImage: img("photo-1512453979798-5ea266f8880c"), startingPrice: 149400, rating: 4.7, reviewCount: 530, bestSeason: "Oct – Apr", isFeatured: true, highlights: ["Desert safari", "Burj Khalifa suites", "Yacht marina"] },
  { slug: "santorini", name: "Santorini", country: "Greece", continent: "Europe", tagline: "Caldera sunsets & whitewashed cliffs", heroImage: img("photo-1570077188670-e3a8d69ac5ff"), startingPrice: 174300, rating: 4.9, reviewCount: 368, bestSeason: "May – Oct", isFeatured: true, highlights: ["Caldera suites", "Catamaran cruise", "Sunset at Oia"] },
  { slug: "bali", name: "Bali", country: "Indonesia", continent: "Asia", tagline: "Jungle villas & rice-terrace serenity", heroImage: img("photo-1537953773345-d172ccf13cf1"), startingPrice: 124500, rating: 4.8, reviewCount: 624, bestSeason: "Apr – Oct", isFeatured: false, highlights: ["Cliffside villas", "Ubud retreats", "Wellness spas"] },
  { slug: "kyoto", name: "Kyoto", country: "Japan", continent: "Asia", tagline: "Ancient temples & cherry blossoms", heroImage: img("photo-1493976040374-85c8e12f0c0e"), startingPrice: 215800, rating: 4.9, reviewCount: 241, bestSeason: "Mar – May · Oct – Nov", isFeatured: false, highlights: ["Ryokan stays", "Tea ceremony", "Kaiseki dining"] },
];

const packages = [
  { slug: "maldives-overwater-escape", title: "Maldives Overwater Escape", destinationSlug: "maldives", location: "South Malé Atoll, Maldives", heroImage: img("photo-1514282401047-d79a71a590e8"), durationDays: 6, durationNights: 5, price: 348600, oldPrice: 406700, rating: 4.9, reviewCount: 168, groupSize: "2 guests", category: "Honeymoon", badge: "Best Seller", isFeatured: true, summary: "Five nights in a private overwater villa with seaplane transfers and a sandbank dinner.", highlights: ["Private overwater villa", "Seaplane transfers", "Sandbank dinner"], inclusions: ["5 nights villa", "All meals", "Seaplane transfers"], exclusions: ["International airfare", "Insurance"], itinerary: [ { dayNumber: 1, title: "Arrival by seaplane", description: "Transfer to your island and sunset on your deck.", stay: "Overwater Villa", meals: ["Dinner"] }, { dayNumber: 2, title: "Reef discovery", description: "Guided snorkel over the house reef.", stay: "Overwater Villa", meals: ["Breakfast", "Lunch", "Dinner"] }, { dayNumber: 3, title: "Sandbank & dolphins", description: "Private sandbank picnic and dolphin cruise.", stay: "Overwater Villa", meals: ["Breakfast", "Dinner"] } ] },
  { slug: "swiss-alps-grand-rail", title: "Swiss Alps Grand Rail Journey", destinationSlug: "switzerland", location: "Zermatt · Lucerne · Interlaken", heroImage: img("photo-1531366936337-7c912a4589a7"), durationDays: 7, durationNights: 6, price: 448200, rating: 4.8, reviewCount: 94, groupSize: "2–8 guests", category: "Luxury", badge: "Signature", isFeatured: true, summary: "Seven days across Switzerland aboard panoramic trains with five-star alpine stays.", highlights: ["Glacier Express", "Jungfraujoch", "Five-star hotels"], inclusions: ["6 nights 5-star", "First-class rail", "Jungfraujoch excursion"], exclusions: ["International airfare", "Lunches"], itinerary: [ { dayNumber: 1, title: "Arrive Lucerne", description: "Private transfer to lakeside Lucerne.", stay: "Grand Hotel", meals: ["Dinner"] }, { dayNumber: 2, title: "Glacier Express", description: "Panoramic rail journey to Zermatt.", stay: "Zermatt Palace", meals: ["Breakfast", "Dinner"] }, { dayNumber: 3, title: "Jungfraujoch", description: "Ascend to the Top of Europe.", stay: "Victoria-Jungfrau", meals: ["Breakfast"] } ] },
  { slug: "dubai-desert-and-skyline", title: "Dubai Desert & Skyline", destinationSlug: "dubai", location: "Dubai, UAE", heroImage: img("photo-1512453979798-5ea266f8880c"), durationDays: 5, durationNights: 4, price: 265600, oldPrice: 307100, rating: 4.7, reviewCount: 142, groupSize: "2–6 guests", category: "Luxury", isFeatured: true, summary: "Four nights blending desert glamping, Burj Khalifa suites and a private yacht cruise.", highlights: ["Burj Khalifa suite", "Desert glamping", "Yacht cruise"], inclusions: ["4 nights luxury", "Desert safari", "Yacht cruise"], exclusions: ["International airfare", "Gratuities"], itinerary: [ { dayNumber: 1, title: "Arrival & skyline", description: "Transfer to your downtown suite.", stay: "Address Downtown", meals: ["Dinner"] }, { dayNumber: 2, title: "Desert glamping", description: "Dune-bashing and a private dinner under the stars.", stay: "Desert Camp", meals: ["Breakfast", "Dinner"] }, { dayNumber: 3, title: "Yacht & marina", description: "Afternoon yacht cruise at sunset.", stay: "Address Downtown", meals: ["Breakfast"] } ] },
  { slug: "santorini-romance", title: "Santorini Caldera Romance", destinationSlug: "santorini", location: "Oia & Imerovigli, Santorini", heroImage: img("photo-1570077188670-e3a8d69ac5ff"), durationDays: 6, durationNights: 5, price: 315400, rating: 4.9, reviewCount: 121, groupSize: "2 guests", category: "Honeymoon", badge: "Most Romantic", isFeatured: false, summary: "Cliffside suites, a private catamaran cruise and the world's most famous sunset.", highlights: ["Cave suite", "Catamaran cruise", "Sunset in Oia"], inclusions: ["5 nights cave suite", "Catamaran cruise", "Transfers"], exclusions: ["International airfare", "Lunches"], itinerary: [ { dayNumber: 1, title: "Arrival in Oia", description: "Transfer to your caldera suite.", stay: "Cave Suite", meals: ["Dinner"] }, { dayNumber: 2, title: "Catamaran cruise", description: "Sail past the red and white beaches.", stay: "Cave Suite", meals: ["Breakfast", "Lunch"] } ] },
  { slug: "bali-wellness-retreat", title: "Bali Wellness Retreat", destinationSlug: "bali", location: "Ubud & Uluwatu, Bali", heroImage: img("photo-1537953773345-d172ccf13cf1"), durationDays: 8, durationNights: 7, price: 240700, rating: 4.8, reviewCount: 203, groupSize: "1–4 guests", category: "Wellness", isFeatured: true, summary: "Jungle villas, daily yoga, healing spa rituals and a clifftop finale.", highlights: ["Pool villa", "Daily yoga", "Healing ritual"], inclusions: ["7 nights villa", "Daily yoga", "Spa rituals"], exclusions: ["International airfare", "Gratuities"], itinerary: [ { dayNumber: 1, title: "Arrive Ubud", description: "Welcome herbal tonic and gentle stretch.", stay: "Ubud Villa", meals: ["Dinner"] }, { dayNumber: 2, title: "Sunrise yoga", description: "Yoga over the canopy and a flower-bath ritual.", stay: "Ubud Villa", meals: ["Breakfast", "Lunch"] } ] },
  { slug: "kyoto-cultural-immersion", title: "Kyoto Cultural Immersion", destinationSlug: "kyoto", location: "Kyoto & Arashiyama, Japan", heroImage: img("photo-1493976040374-85c8e12f0c0e"), durationDays: 6, durationNights: 5, price: 381800, rating: 4.9, reviewCount: 76, groupSize: "2–6 guests", category: "Cultural", isFeatured: false, summary: "Ryokan stays, private tea ceremonies, bamboo groves and a kaiseki masterclass.", highlights: ["Ryokan stay", "Tea ceremony", "Kaiseki masterclass"], inclusions: ["5 nights ryokan", "Private tours", "Tea ceremony"], exclusions: ["International airfare", "Gratuities"], itinerary: [ { dayNumber: 1, title: "Arrive Kyoto", description: "Evening stroll through Gion.", stay: "Riverside Ryokan", meals: ["Dinner"] }, { dayNumber: 2, title: "Temples & torii", description: "Dawn at Fushimi Inari.", stay: "Riverside Ryokan", meals: ["Breakfast"] } ] },
];

const testimonials = [
  { name: "Aisha Al-Rashid", location: "Dubai, UAE", avatarUrl: "https://i.pravatar.cc/200?img=45", rating: 5, trip: "Maldives Overwater Escape", quote: "From the seaplane to the sandbank dinner, every detail was flawless.", isFeatured: true },
  { name: "James Whitfield", location: "London, UK", avatarUrl: "https://i.pravatar.cc/200?img=12", rating: 5, trip: "Swiss Alps Grand Rail", quote: "This is how luxury travel should feel. Effortless.", isFeatured: true },
  { name: "Priya Nair", location: "Mumbai, India", avatarUrl: "https://i.pravatar.cc/200?img=32", rating: 5, trip: "Santorini Caldera Romance", quote: "The concierge anticipated everything. Santorini was pure magic.", isFeatured: true },
];

async function main() {
  console.log("🌱  Seeding LG Travels database…");

  // Clear (respect FK order)
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.testimonial.deleteMany();

  for (const d of destinations) {
    await prisma.destination.create({ data: { ...d, gallery: [d.heroImage], currency: "INR" } });
  }

  for (const p of packages) {
    const dest = await prisma.destination.findUnique({ where: { slug: p.destinationSlug } });
    const { destinationSlug, itinerary, category, ...rest } = p;
    await prisma.package.create({
      data: {
        ...rest,
        category: category as never,
        currency: "INR",
        gallery: [p.heroImage],
        ...(dest ? { destination: { connect: { id: dest.id } } } : {}),
        itinerary: { create: itinerary },
      },
    });
  }

  await prisma.testimonial.createMany({ data: testimonials });

  const counts = {
    destinations: await prisma.destination.count(),
    packages: await prisma.package.count(),
    itineraries: await prisma.itinerary.count(),
    testimonials: await prisma.testimonial.count(),
  };
  console.log("✅  Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
