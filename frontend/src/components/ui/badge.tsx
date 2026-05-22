import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        navy: "bg-navy-50 text-navy-700",
        gold: "bg-gold-100 text-gold-700",
        glass: "glass text-white",
        outline: "border border-navy-700/15 text-navy-700",
        solid: "bg-navy-700 text-white",
      },
    },
    defaultVariants: { variant: "navy" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
