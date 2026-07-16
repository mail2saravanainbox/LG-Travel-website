/** Global site configuration & brand constants. */
export const SITE = {
  name: "LG Travels",
  tagline: "Luxury Travel, Curated for You",
  description:
    "LG Travels designs cinematic, bespoke luxury journeys across the globe — private resorts, drone-worthy landscapes and seamless, concierge-grade booking.",
  url: "https://lgtravels.in",
  ogImage:
    "https://res.cloudinary.com/dzevugvgg/image/upload/v1779640600/lg-travels/site/images/1507525428034-b723cf961d3e.jpg",
  email: "info@lgtravels.in",
  // Two business numbers, shown in this order site-wide. formatPhone() adds +91.
  phone: "7399900999, 9435148453",
  hours: "10:00 AM – 10:00 PM",
  addressLabel: "Corporate & Registered Office · LG Travels",
  address:
    "Unit No.2, 2nd Floor, Gostalaya Building, Opp Sipani Guest House, Chatribari Road, Guwahati – 781001",
  // Real handles; also the fallback when the settings API is unreachable.
  social: {
    instagram: "https://www.instagram.com/travels.lg/",
    facebook: "https://www.facebook.com/profile.php?id=61574317688216",
    linkedin: "https://www.linkedin.com/in/l-g-travels-478205417/",
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
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;
