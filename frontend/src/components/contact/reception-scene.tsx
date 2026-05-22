import Image from "next/image";

/**
 * A "royal reception" lobby scene rendered in CSS:
 * a panelled back wall with the LG logo as a backlit sign, warm spot-lighting,
 * a marble floor in perspective, and a reception desk in the foreground.
 */
export function ReceptionScene({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative flex min-h-[68vh] items-center justify-center overflow-hidden pt-20">
      {/* Back wall */}
      <div
        className="absolute inset-x-0 top-0 h-[64%]"
        style={{
          background:
            "linear-gradient(180deg,#04123a 0%,#061c4f 55%,#082567 100%)",
        }}
      >
        {/* Panelling / pilasters */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 118px, rgba(244,180,0,.16) 118px 120px, transparent 120px 240px)",
          }}
        />
        {/* Wainscot line */}
        <div className="absolute inset-x-0 bottom-10 h-px bg-gold-400/30" />
        <div className="absolute inset-x-0 bottom-6 h-px bg-gold-400/20" />

        {/* Warm spotlights */}
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-b-full bg-gold-300/15 blur-3xl" />
        <div className="absolute left-[18%] top-0 h-56 w-56 rounded-full bg-gold-200/10 blur-3xl" />
        <div className="absolute right-[18%] top-0 h-56 w-56 rounded-full bg-gold-200/10 blur-3xl" />

        {/* Backlit LG logo sign */}
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="relative">
            <div className="absolute -inset-x-16 -inset-y-10 rounded-[2.5rem] bg-gold-300/15 blur-2xl" />
            <Image
              src="/logo-white.png"
              alt="LG Travels"
              width={416}
              height={275}
              priority
              className="relative h-28 w-auto drop-shadow-[0_8px_30px_rgba(244,180,0,0.25)] md:h-36"
            />
          </div>
          <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.4em] text-gold-300/80">
            Luxury Travel Concierge
          </p>
        </div>
      </div>

      {/* Marble floor in perspective */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(180deg,#0c1733 0%,#16203f 40%,#202a4d 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 78px, rgba(255,255,255,.06) 78px 80px)",
            transform: "perspective(420px) rotateX(48deg)",
            transformOrigin: "top",
          }}
        />
        {/* glow reflection */}
        <div className="absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 bg-gold-300/10 blur-3xl" />
      </div>

      {/* Reception desk */}
      <div className="absolute bottom-[8%] left-1/2 z-20 w-[min(92%,46rem)] -translate-x-1/2">
        {/* Marble top */}
        <div className="relative mx-auto h-5 w-full rounded-t-xl bg-gradient-to-b from-white/85 to-white/55 shadow-[0_-2px_10px_rgba(255,255,255,0.3)]" />
        {/* Front face with gold fluting */}
        <div
          className="relative h-28 w-full rounded-b-md md:h-32"
          style={{
            backgroundColor: "#082567",
            backgroundImage:
              "linear-gradient(180deg,#0a2a6e 0%,#061c4f 100%), repeating-linear-gradient(90deg, rgba(244,180,0,0) 0 38px, rgba(244,180,0,.22) 38px 40px)",
            backgroundBlendMode: "multiply",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)",
          }}
        >
          <span className="absolute inset-x-0 top-3 text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-gold-300/90">
            Reception
          </span>
        </div>
        {/* Desk lamp glow */}
        <div className="absolute -top-6 right-10 h-10 w-10 rounded-full bg-gold-300/40 blur-xl" />
      </div>

      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(2,10,34,0.55)]" />

      {/* Heading */}
      <div className="container-lux relative z-30 -mt-10 text-center text-white">
        <h1 className="text-balance font-display text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-white/80">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
