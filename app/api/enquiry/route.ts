import { NextResponse } from "next/server";
import { submitEnquiryToFormspree } from "@/lib/formspree-submit";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  event_type?: string;
  event_date?: string;
  message?: string;
  _subject?: string;
  _gotcha?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body._gotcha?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const event_type = body.event_type?.trim();
  const message = body.message?.trim();

  if (!name || !email || !event_type || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const result = await submitEnquiryToFormspree({
    name,
    email,
    phone: body.phone?.trim() || null,
    event_type,
    event_date: body.event_date?.trim() || null,
    message,
    _subject: body._subject?.trim(),
  });

  if (!result.ok) {
    console.error("[enquiry] Formspree failed:", result.error);
    return NextResponse.json(
      { error: "Could not send your enquiry. Please try again or contact us by phone." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
