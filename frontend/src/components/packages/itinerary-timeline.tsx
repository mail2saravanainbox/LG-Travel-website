import { Bed, UtensilsCrossed } from "lucide-react";
import type { ItineraryDay } from "@/types";

export function ItineraryTimeline({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-dashed border-navy-700/15 pl-8">
      {itinerary.map((day) => (
        <li key={day.day} className="relative">
          <span className="absolute -left-[2.6rem] grid h-9 w-9 place-items-center rounded-full bg-navy-700 font-display text-sm font-bold text-white shadow-soft">
            {day.day}
          </span>
          <div className="rounded-2xl border border-navy-700/8 bg-white p-5 shadow-soft">
            <h4 className="font-display text-lg font-semibold text-navy-900">
              Day {day.day} · {day.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{day.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/55">
              {day.stay && (
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-gold-500" /> {day.stay}
                </span>
              )}
              {day.meals && day.meals.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-4 w-4 text-gold-500" /> {day.meals.join(", ")}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
