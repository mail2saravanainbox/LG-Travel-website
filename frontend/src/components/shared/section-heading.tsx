import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-gold-300" : "text-gold-500",
          )}
        >
          <span className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "max-w-2xl text-balance text-3xl font-bold leading-[1.1] md:text-4xl lg:text-[2.75rem]",
          light ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-balance text-base leading-relaxed md:text-lg",
            light ? "text-white/70" : "text-ink/65",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
