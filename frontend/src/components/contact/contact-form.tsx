"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";
import { createInquiry } from "@/services/inquiries.service";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  destination: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (min. 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  // Show the success screen only after the enquiry actually persists — react-hook-form's
  // `isSubmitSuccessful` is true whenever onSubmit resolves, even on a caught API failure,
  // which would falsely confirm a lost lead.
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(values: FormValues) {
    try {
      await createInquiry(values);
      setSubmitted(true);
    } catch (err) {
      // Surface a friendly error; the API validates server-side too.
      setError("root", {
        message: (err as Error).message || "Something went wrong. Please try again.",
      });
    }
  }

  if (submitted) {
    return (
      <div className="grid place-items-center rounded-3xl border border-emerald-200 bg-emerald-50 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 font-display text-2xl font-bold text-navy-900">Thank you!</h3>
        <p className="mt-2 max-w-sm text-ink/60">
          Your enquiry is on its way. A travel designer will be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}>
          <Input placeholder="Jane Doe" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input placeholder="+971 50 000 0000" {...register("phone")} />
        </Field>
        <Field label="Destination of interest" error={errors.destination?.message}>
          <Input placeholder="e.g. Maldives" {...register("destination")} />
        </Field>
      </div>
      <Field label="Approx. budget per person" error={errors.budget?.message}>
        <Input placeholder="e.g. ₹2,00,000 – ₹5,00,000" {...register("budget")} />
      </Field>
      <Field label="Tell us about your dream trip" error={errors.message?.message}>
        <Textarea placeholder="Who's travelling, when, and what would make it unforgettable?" {...register("message")} />
      </Field>
      {errors.root && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{errors.root.message}</p>
      )}
      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send enquiry"} <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  // Wrap the input in the <label> so screen readers associate them (the label
  // and input were previously unlinked siblings).
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-800">{label}</span>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </label>
  );
}
