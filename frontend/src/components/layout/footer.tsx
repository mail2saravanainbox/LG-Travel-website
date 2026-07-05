import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_LINKS } from "@/constants/site";
import { fetchSiteSettings } from "@/services/settings.service";
import { formatAddress, formatPhone } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";

export async function Footer() {
  const site = await fetchSiteSettings();
  const socials = [
    { icon: InstagramIcon, href: site.social.instagram, label: "Instagram" },
    { icon: FacebookIcon, href: site.social.facebook, label: "Facebook" },
    { icon: TwitterIcon, href: site.social.twitter, label: "Twitter" },
    { icon: LinkedinIcon, href: site.social.linkedin, label: "LinkedIn" },
    { icon: YoutubeIcon, href: site.social.youtube, label: "YouTube" },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden
      />
      <div className="container-lux relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image
            src="/logo-white.png"
            alt={site.name}
            width={416}
            height={275}
            className="h-16 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {site.description}
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span className="whitespace-pre-line">{formatAddress(site.address)}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              {formatPhone(site.phone)}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              {site.email}
            </li>
          </ul>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              {heading}
            </h4>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-lux flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
