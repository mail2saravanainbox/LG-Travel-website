import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * LG Travels brand logo (real artwork).
 * - light=false → navy version (for white/light backgrounds)
 * - light=true  → white version (for dark backgrounds / hero, footer)
 */
export function Logo({
  light = false,
  className,
  priority = false,
}: {
  light?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="LG Travels — home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={light ? "/logo-white.png" : "/logo-navy.png"}
        alt="LG Travels"
        width={416}
        height={275}
        priority={priority}
        className="h-12 w-auto md:h-14"
      />
    </Link>
  );
}
