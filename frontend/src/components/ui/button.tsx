import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-700 text-white shadow-soft hover:bg-navy-800 hover:shadow-lift hover:-translate-y-0.5",
        gold: "bg-gold-400 text-navy-900 shadow-soft hover:bg-gold-300 hover:shadow-lift hover:-translate-y-0.5",
        outline:
          "border border-navy-700/20 bg-white/60 text-navy-800 backdrop-blur hover:border-navy-700/40 hover:bg-white",
        ghost: "text-navy-800 hover:bg-navy-50",
        glass:
          "glass text-white hover:bg-white/20 hover:-translate-y-0.5",
        link: "text-navy-700 underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (href) {
      return (
        <Link href={href} className={classes}>
          {props.children}
        </Link>
      );
    }
    return <button ref={ref} className={classes} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
