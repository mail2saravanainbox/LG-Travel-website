"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { EASE_LUX } from "@/lib/motion";
import { NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Pages with a dark cinematic hero want a transparent navbar at the top.
  const transparentRoutes = ["/"];
  const overHero = transparentRoutes.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !overHero;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-navy-700/8 bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_-12px_rgba(8,37,103,0.15)]"
          : "bg-transparent",
      )}
    >
      <nav className="container-lux flex h-20 items-center justify-between py-2">
        <Logo light={!solid} priority />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    solid ? "text-navy-800/80 hover:text-navy-900" : "text-white/85 hover:text-white",
                    active && (solid ? "text-navy-900" : "text-white"),
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-400"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {isSignedIn ? (
            <>
              <Button href="/dashboard" variant={solid ? "ghost" : "glass"} size="sm">
                Dashboard
              </Button>
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            </>
          ) : (
            <Button href="/login" variant={solid ? "ghost" : "glass"} size="sm">
              Login
            </Button>
          )}
          <Button href="/packages" variant="gold" size="sm">
            Plan Your Trip
          </Button>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden",
            solid ? "text-navy-800 hover:bg-navy-50" : "text-white hover:bg-white/10",
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: EASE_LUX }}
              className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full text-navy-800 hover:bg-navy-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-xl px-4 py-3 text-lg font-medium text-navy-800 hover:bg-navy-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-6">
                {isSignedIn ? (
                  <Button href="/dashboard" variant="outline" size="lg">
                    My Dashboard
                  </Button>
                ) : (
                  <Button href="/login" variant="outline" size="lg">
                    Login
                  </Button>
                )}
                <Button href="/packages" variant="gold" size="lg">
                  Plan Your Trip
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
