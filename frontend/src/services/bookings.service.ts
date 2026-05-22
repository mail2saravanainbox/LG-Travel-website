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

/** Create a booking on the API. Returns the booking with its reference. */
export function createBooking(input: BookingInput) {
  return apiPost<BookingResult>("/bookings", input);
}
