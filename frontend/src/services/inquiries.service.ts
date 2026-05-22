import { apiPost } from "./api";

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  destination?: string;
  budget?: string;
  message: string;
}

/** Submit a contact/lead enquiry to the API. */
export function createInquiry(input: InquiryInput) {
  return apiPost<{ id: string }>("/inquiries", input);
}
