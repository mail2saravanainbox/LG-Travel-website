"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getMyBookings, type MyBooking } from "@/services/bookings.service";

/**
 * Fetches the signed-in user's bookings from the API using a Clerk token.
 * Shared by the dashboard Overview, Bookings, and Payments pages.
 */
export function useMyBookings() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no token");
        const data = await getMyBookings(token);
        if (active) setBookings(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, getToken]);

  return { bookings, loading, error };
}
