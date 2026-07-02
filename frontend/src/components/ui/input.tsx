import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onWheel, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      // Number inputs otherwise increment/decrement when you scroll the page
      // with the cursor over them — silently corrupting entered values (e.g. a
      // price of 448300 drifting to 448298). Drop focus so the wheel scrolls instead.
      onWheel={(e) => {
        if (type === "number") (e.target as HTMLInputElement).blur();
        onWheel?.(e);
      }}
      className={cn(
        "flex h-12 w-full rounded-xl border border-navy-700/15 bg-white px-4 text-sm text-ink shadow-sm transition-colors placeholder:text-ink/40 focus-visible:border-navy-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-xl border border-navy-700/15 bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-ink/40 focus-visible:border-navy-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/15 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-1.5 block text-sm font-medium text-navy-800", className)}
    {...props}
  />
));
Label.displayName = "Label";
