import { apiPost } from "./api";

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
