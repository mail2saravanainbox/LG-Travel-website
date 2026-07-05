import { apiPost, authGet } from "./api";

export interface BookingInput {
  packageSlug: string;
  travelers: number;
  startDate?: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
}

export interface BookingResult {
  id: string;
  reference: string;
  total: string;
  currency: string;
  status: string;
}

/**
 * Create a booking on the API. Returns the booking with its reference.
 * `token` is a Clerk session token — the endpoint requires a signed-in user.
 */
export function createBooking(input: BookingInput, token?: string) {
  return apiPost<BookingResult>("/bookings", input, token);
}

export interface MyBookingPayment {
  id: string;
  amount: string;
  status: string;
  method?: string | null;
  createdAt: string;
}

export interface MyBooking {
  id: string;
  reference: string;
  travelers: number;
  startDate: string | null;
  leadName: string;
  leadEmail: string;
  leadPhone?: string | null;
  subtotal: string;
  taxes: string;
  total: string;
  currency: string;
  status: string;
  createdAt: string;
  package?: {
    slug: string;
    title: string;
    heroImage: string;
    location?: string | null;
    durationDays?: number | null;
  } | null;
  payments?: MyBookingPayment[];
}

/**
 * The signed-in user's own bookings. `token` is a Clerk session token — the
 * endpoint requires a signed-in user and returns only that user's bookings.
 */
export function getMyBookings(token: string) {
  return authGet<MyBooking[]>("/bookings/mine", token);
}
