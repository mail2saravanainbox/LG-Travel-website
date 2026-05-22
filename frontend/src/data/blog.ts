import type { BlogPost } from "@/types";

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const lorem = `
Luxury travel is no longer about ticking destinations off a list — it is about how a place makes you feel, the people who guide you through it, and the small, perfectly engineered moments that you carry home.

At LG Travels we obsess over those moments. The seaplane that lands as the sun dips. The private guide who knows which café opens early. The villa positioned for the best light. This is the difference between a holiday and a journey designed around you.

In this piece we share how our travel designers approach the craft, and what to look for when you plan your own escape. Whether you dream of overwater villas, alpine railways or desert nights, the principles are the same: intention, access and time.
`.trim();

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "art-of-slow-luxury-travel",
    title: "The Art of Slow, Luxury Travel",
    excerpt:
      "Why the most memorable journeys are measured in moments, not miles — and how to design a trip that lingers long after you return.",
    content: lorem,
    cover: img("photo-1476514525535-07fb3b4ae5f1"),
    author: { name: "Elena Vasquez", avatar: "https://i.pravatar.cc/200?img=47", role: "Head of Travel Design" },
    category: "Inspiration",
    readingTime: 6,
    publishedAt: "2026-04-18",
    tags: ["luxury", "philosophy", "slow travel"],
  },
  {
    id: "b2",
    slug: "maldives-when-to-go",
    title: "Maldives: When to Go & Which Atoll to Choose",
    excerpt:
      "A designer's guide to seasons, atolls and house reefs so you arrive at the right island at exactly the right time.",
    content: lorem,
    cover: img("photo-1573843981267-be1999ff37cd"),
    author: { name: "Marcus Lee", avatar: "https://i.pravatar.cc/200?img=14", role: "Indian Ocean Specialist" },
    category: "Destinations",
    readingTime: 8,
    publishedAt: "2026-04-02",
    tags: ["maldives", "guide", "beaches"],
  },
  {
    id: "b3",
    slug: "alpine-rail-bucket-list",
    title: "Five Alpine Rail Journeys for Your Bucket List",
    excerpt:
      "From the Glacier Express to the Bernina line, these are the panoramic train routes worth crossing the world for.",
    content: lorem,
    cover: img("photo-1527668752968-14dc70a27c95"),
    author: { name: "Sophie Dubois", avatar: "https://i.pravatar.cc/200?img=25", role: "Europe Specialist" },
    category: "Adventure",
    readingTime: 7,
    publishedAt: "2026-03-21",
    tags: ["switzerland", "rail", "europe"],
  },
  {
    id: "b4",
    slug: "desert-nights-dubai",
    title: "Desert Nights: A New Way to Experience Dubai",
    excerpt:
      "Beyond the skyline lies a quieter luxury — private dunes, falconry at dawn and dinner beneath an unbroken sky.",
    content: lorem,
    cover: img("photo-1518684079-3c830dcef090"),
    author: { name: "Omar Haddad", avatar: "https://i.pravatar.cc/200?img=59", role: "Middle East Specialist" },
    category: "Destinations",
    readingTime: 5,
    publishedAt: "2026-03-08",
    tags: ["dubai", "desert", "uae"],
  },
  {
    id: "b5",
    slug: "honeymoon-design-guide",
    title: "How We Design the Perfect Honeymoon",
    excerpt:
      "The questions we ask, the surprises we plan and the rhythm that makes a honeymoon feel effortless and deeply personal.",
    content: lorem,
    cover: img("photo-1570077188670-e3a8d69ac5ff"),
    author: { name: "Elena Vasquez", avatar: "https://i.pravatar.cc/200?img=47", role: "Head of Travel Design" },
    category: "Inspiration",
    readingTime: 6,
    publishedAt: "2026-02-24",
    tags: ["honeymoon", "romance", "planning"],
  },
  {
    id: "b6",
    slug: "wellness-travel-2026",
    title: "Wellness Travel in 2026: Beyond the Spa",
    excerpt:
      "Sound healing, forest bathing and longevity retreats — the wellness trends shaping how the world rests and resets.",
    content: lorem,
    cover: img("photo-1518548419970-58e3b4079ab2"),
    author: { name: "Maya Patel", avatar: "https://i.pravatar.cc/200?img=44", role: "Wellness Curator" },
    category: "Wellness",
    readingTime: 5,
    publishedAt: "2026-02-10",
    tags: ["wellness", "bali", "trends"],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
