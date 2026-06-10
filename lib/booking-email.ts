import { formatBritishLongDate } from "@/lib/event-date-format";

export type BookingEmailPayload = {
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  message: string;
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  "private-party": "Private party",
  corporate: "Corporate event",
  residency: "Venue residency",
  terrace: "Terrace / garden party",
  festival: "Festival",
  gathering: "The Gathering",
  resident: "The Resident",
  garden: "Garden parties",
  other: "Other",
};

const DEFAULT_NOTIFY_EMAIL = "info@ajeventspromotions.com";
const DEFAULT_FROM_EMAIL = "DJ Ludzy <onboarding@resend.dev>";

function eventTypeLabel(value: string): string {
  return EVENT_TYPE_LABELS[value] ?? value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendBookingNotificationEmail(
  payload: BookingEmailPayload,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const to = process.env.BOOKING_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;

  const eventType = eventTypeLabel(payload.event_type);
  const phone = payload.phone?.trim() || "Not provided";
  const eventDateDisplay = payload.event_date
    ? formatBritishLongDate(payload.event_date)
    : "Not specified";

  const subject = `New booking enquiry — ${eventType} (${payload.name})`;

  const text = [
    "New booking enquiry on ludzy.online",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${phone}`,
    `Event type: ${eventType}`,
    `Event date: ${eventDateDisplay}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = [
    "<h2>New booking enquiry</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`,
    `<p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>`,
    `<p><strong>Event date:</strong> ${escapeHtml(eventDateDisplay)}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p style="white-space: pre-wrap">${escapeHtml(payload.message)}</p>`,
  ].join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Resend API error (${res.status}): ${body || res.statusText}`,
      };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `Failed to send email: ${msg}` };
  }
}
