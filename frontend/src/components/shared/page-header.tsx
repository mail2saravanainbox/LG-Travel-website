import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  image?: string;
  crumbs?: Crumb[];
  /** Optional call-to-action buttons rendered under the description. */
  actions?: React.ReactNode;
}

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dzevugvgg/image/upload/v1779640606/lg-travels/site/images/1488646953014-85cb44e25828.jpg";

export function PageHeader({
  title,
  description,
  eyebrow,
  image = DEFAULT_IMAGE,
  crumbs = [],
  actions,
}: PageHeaderProps) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden pt-18">
      <Image src={image} alt="" fill priority className="object-cover" />
      <div className="hero-overlay absolute inset-0" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/70 to-transparent"
        aria-hidden
      />

      <div className="container-lux relative z-10 pb-12 pt-28 text-white">
        <Reveal>
          {crumbs.length > 0 && (
            <nav className="mb-4 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-balance text-lg text-white/75">{description}</p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
        </Reveal>
      </div>
    </section>
  );
}
