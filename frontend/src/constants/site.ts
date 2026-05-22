/** Global site configuration & brand constants. */
export const SITE = {
  name: "LG Travels",
  tagline: "Luxury Travel, Curated for You",
  description:
    "LG Travels designs cinematic, bespoke luxury journeys across the globe — private resorts, drone-worthy landscapes and seamless, concierge-grade booking.",
  url: "https://lgtravels.com",
  ogImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  email: "support@makevoyage.com",
  phone: "757 808 7777",
  hours: "10:00 AM – 10:00 PM",
  addressLabel: "Corporate & Registered Office · LG Travels",
  address:
    "Unit No.2, 2nd Floor, Gostalaya Building, Opp Sipani Guest House, Chatribari Road, Guwahati – 781001",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations", href: "/destinations" },
    { label: "Tour Packages", href: "/packages" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Travel Journal", href: "/blog" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Careers", href: "/about#careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;
