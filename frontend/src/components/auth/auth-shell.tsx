import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640600/lg-travels/site/images/1507525428034-b723cf961d3e.jpg"
          alt="Luxury beach"
          fill
          priority
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Logo light />
          <figure className="glass max-w-md rounded-3xl p-7">
            <Quote className="h-8 w-8 text-gold-400" />
            <blockquote className="mt-3 font-display text-xl leading-relaxed">
              The most seamless travel experience I&apos;ve ever had — every detail handled, every
              moment perfect.
            </blockquote>
            <figcaption className="mt-4 text-sm text-white/70">
              Aisha Al-Rashid · Dubai
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold text-navy-900 lg:mt-0">{title}</h1>
          <p className="mt-2 text-ink/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-ink/60">{footer}</p>
          <p className="mt-6 text-center text-xs text-ink/40">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
