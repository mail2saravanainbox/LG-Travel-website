import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 px-6 text-center text-white">
      <div>
        <Compass className="mx-auto h-16 w-16 text-gold-400" />
        <p className="mt-6 font-display text-7xl font-bold">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">You&apos;ve wandered off the map</h1>
        <p className="mt-3 text-white/60">
          The page you&apos;re looking for doesn&apos;t exist — but the world is full of places that do.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="gold" size="lg">
            Back home
          </Button>
          <Button href="/packages" variant="glass" size="lg">
            Explore trips
          </Button>
        </div>
      </div>
    </div>
  );
}
