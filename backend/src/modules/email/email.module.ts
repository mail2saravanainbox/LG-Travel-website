import { Global, Injectable, Logger, Module } from "@nestjs/common";

/**
 * Sends transactional email via the Resend REST API (no SDK dependency — uses
 * global fetch). Sending is best-effort and NEVER throws: a mail failure must
 * not break a booking or inquiry. If RESEND_API_KEY is unset (e.g. local dev),
 * sends are skipped with a warning.
 *
 * Env:
 *   RESEND_API_KEY  — Resend API key (required to actually send)
 *   EMAIL_FROM      — verified sender, e.g. "LG Travels <bookings@lgtravels.in>"
 *   NOTIFY_EMAIL    — LG Travels team inbox that receives new-lead/booking alerts
 */

const BRAND = "#082567";
const GOLD = "#a9853f";

function shell(heading: string, body: string): string {
  return `<div style="margin:0;padding:24px;background:#f4f4f0;font-family:Arial,Helvetica,sans-serif;color:#16181d">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e5dd">
    <div style="background:${BRAND};padding:20px 28px">
      <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:.5px">LG&nbsp;Travels</span>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 14px;font-size:20px;color:${BRAND}">${heading}</h1>
      ${body}
    </div>
    <div style="padding:16px 28px;background:#faf9f5;border-top:1px solid #eeede6;color:#8a8f99;font-size:12px">
      LG Travels · Guwahati, India · <a href="https://lgtravels.in" style="color:${GOLD};text-decoration:none">lgtravels.in</a>
    </div>
  </div>
</div>`;
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;color:#7b818d;font-size:13px;width:130px;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#16181d;font-size:14px;font-weight:600">${value}</td>
  </tr>`;
}

export interface BookingEmailData {
  reference: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string | null;
  travelers: number;
  startDate?: Date | string | null;
  total: number | string;
  currency: string;
}

export interface InquiryEmailData {
  name: string;
  email: string;
  phone?: string | null;
  destination?: string | null;
  budget?: string | null;
  message?: string | null;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger("EmailService");
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly from = process.env.EMAIL_FROM || "LG Travels <onboarding@resend.dev>";
  private readonly notify = process.env.NOTIFY_EMAIL || "info@lgtravels.in";

  private async send(to: string | string[], subject: string, html: string): Promise<void> {
    const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
    if (!recipients.length) return;
    if (!this.apiKey) {
      this.logger.warn(`RESEND_API_KEY not set — skipping email "${subject}"`);
      return;
    }
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: this.from, to: recipients, subject, html }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        this.logger.error(`Resend failed (${res.status}) for "${subject}": ${detail}`);
      } else {
        this.logger.log(`Sent "${subject}" to ${recipients.join(", ")}`);
      }
    } catch (err) {
      this.logger.error(`Resend error for "${subject}": ${(err as Error).message}`);
    }
  }

  private money(amount: number | string, currency: string): string {
    const n = Number(amount);
    if (!Number.isFinite(n)) return "—";
    try {
      return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${currency} ${n}`;
    }
  }

  private date(d?: Date | string | null): string {
    if (!d) return "Flexible";
    const dt = new Date(d);
    return Number.isNaN(dt.getTime())
      ? "Flexible"
      : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  /** Fire-and-forget: staff alert + customer acknowledgement for a new booking. */
  sendBookingEmails(b: BookingEmailData, packageTitle: string): void {
    const total = this.money(b.total, b.currency);
    const staff = shell(
      `New booking · ${b.reference}`,
      `<table style="width:100%;border-collapse:collapse">
        ${row("Package", packageTitle)}
        ${row("Reference", b.reference)}
        ${row("Traveller", b.leadName)}
        ${row("Email", b.leadEmail)}
        ${row("Phone", b.leadPhone)}
        ${row("Travellers", String(b.travelers))}
        ${row("Start date", this.date(b.startDate))}
        ${row("Estimated total", total)}
        ${row("Status", "Pending — arrange payment on confirmation")}
      </table>
      <p style="margin:18px 0 0;font-size:13px;color:#7b818d">Follow up within 24 hours to confirm availability and arrange payment.</p>`,
    );
    const customer = shell(
      "Booking request received",
      `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${b.leadName}, thank you for booking with LG Travels. We've received your request and a travel designer will reach out <strong>within 24 hours</strong> to confirm the details and arrange secure payment.</p>
       <table style="width:100%;border-collapse:collapse">
        ${row("Trip", packageTitle)}
        ${row("Reference", b.reference)}
        ${row("Travellers", String(b.travelers))}
        ${row("Estimated total", total)}
       </table>
       <p style="margin:16px 0 0;font-size:13px;color:#7b818d">You haven't been charged. This is a booking request pending confirmation.</p>`,
    );
    void this.send(this.notify, `New booking ${b.reference} — ${packageTitle}`, staff);
    void this.send(b.leadEmail, `We've received your booking request (${b.reference})`, customer);
  }

  /** Fire-and-forget: staff alert + customer acknowledgement for a new inquiry. */
  sendInquiryEmails(i: InquiryEmailData): void {
    const staff = shell(
      `New enquiry from ${i.name}`,
      `<table style="width:100%;border-collapse:collapse">
        ${row("Name", i.name)}
        ${row("Email", i.email)}
        ${row("Phone", i.phone)}
        ${row("Destination", i.destination)}
        ${row("Budget", i.budget)}
      </table>
      <p style="margin:16px 0 4px;color:#7b818d;font-size:13px">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${i.message ?? "—"}</p>`,
    );
    const customer = shell(
      "Thanks for reaching out",
      `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${i.name}, thank you for contacting LG Travels. We've received your enquiry and a travel designer will be in touch <strong>within 24 hours</strong>.</p>
       <p style="margin:0;font-size:13px;color:#7b818d">If it's urgent, reply to this email and our team will prioritise your request.</p>`,
    );
    void this.send(this.notify, `New enquiry from ${i.name}`, staff);
    void this.send(i.email, `We've received your enquiry — LG Travels`, customer);
  }
}

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
