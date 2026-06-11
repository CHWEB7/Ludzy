import { FORMSPREE_FORM_ID } from "@/lib/formspree";

export type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string | null;
  event_type: string;
  event_date?: string | null;
  message: string;
  _subject?: string;
};

export async function submitEnquiryToFormspree(
  payload: EnquiryPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      event_type: payload.event_type,
      event_date: payload.event_date || undefined,
      message: payload.message,
      _subject: payload._subject ?? "New Ludzy enquiry from ludzy.online",
      _replyto: payload.email,
    }),
  });

  let body: { error?: string; errors?: Array<{ message: string }> } = {};
  try {
    body = (await response.json()) as typeof body;
  } catch {
    // Formspree may return empty body on some errors
  }

  if (!response.ok) {
    const detail =
      body.error ??
      body.errors?.map((entry) => entry.message).join(", ") ??
      `Formspree returned ${response.status}`;
    return { ok: false, error: detail };
  }

  return { ok: true };
}
