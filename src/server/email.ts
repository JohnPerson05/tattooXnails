// Email delivery for new inquiries (server-only) via Resend.
//
// FREE setup: create a key at resend.com and set RESEND_API_KEY. With the
// default sender (onboarding@resend.dev) you can send WITHOUT verifying a
// domain, but Resend only delivers to YOUR OWN account email — which is exactly
// what we want here (the client's proposal lands in your inbox).
//
// To send to any address and use a custom From, verify a domain in Resend and
// set EMAIL_FROM + INQUIRY_TO accordingly.
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || "Owshie x Celeste <onboarding@resend.dev>";
// Where inquiries are delivered. Falls back to the seed/admin email.
const TO = process.env.INQUIRY_TO || process.env.ADMIN_EMAIL || "";

export const emailConfigured = Boolean(apiKey && TO);

interface InquiryEmail {
  name: string;
  email: string;
  contact: string;
  serviceType: string;
  message: string;
}

export async function sendInquiryEmail(inq: InquiryEmail): Promise<{ sent: boolean; error?: string }> {
  if (!apiKey || !TO) {
    console.warn(
      "[email] Skipped: set RESEND_API_KEY and INQUIRY_TO (or ADMIN_EMAIL) to enable email delivery.",
    );
    return { sent: false, error: "Email not configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const safe = (s: string) => String(s ?? "").replace(/[<>]/g, "");

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `New inquiry — ${safe(inq.serviceType)} — ${safe(inq.name)}`,
      // reply-to the client so you can respond to them directly.
      replyTo: inq.email || undefined,
      text:
        `New inquiry from your website\n\n` +
        `Name: ${inq.name}\n` +
        `Email: ${inq.email || "—"}\n` +
        `Contact: ${inq.contact || "—"}\n` +
        `Service: ${inq.serviceType}\n\n` +
        `Message:\n${inq.message || "—"}\n`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="margin:0 0 4px">New inquiry</h2>
          <p style="color:#666;margin:0 0 16px">From the Owshie x Celeste website</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#888;width:110px">Name</td><td>${safe(inq.name)}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Email</td><td>${safe(inq.email) || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Contact</td><td>${safe(inq.contact) || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Service</td><td>${safe(inq.serviceType)}</td></tr>
          </table>
          <div style="margin-top:16px;padding:14px;background:#f6f6f6;border-radius:8px;white-space:pre-wrap;font-size:14px">${safe(inq.message) || "—"}</div>
        </div>
      `,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { sent: false, error: String(error) };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed:", err);
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
