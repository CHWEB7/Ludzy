import { sendBookingNotificationEmail } from "@/lib/booking-email";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  event_type?: string;
  event_date?: string;
  message?: string;
};

function normalizeDate(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const d = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  return d;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, event_type, event_date, message } = body;

  if (!name?.trim() || !email?.trim() || !event_type?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Booking is not configured yet. Add Supabase env vars in Vercel (see README).",
        code: "missing_env",
      },
      { status: 503 },
    );
  }

  const row = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    event_type: event_type.trim(),
    event_date: normalizeDate(event_date),
    message: message.trim(),
  };

  const { error } = await supabase.from("booking_inquiries").insert(row);

  if (error) {
    console.error("[booking] Supabase insert failed:", error.message, error.code, error.details);

    const hint =
      error.code === "42P01"
        ? "Table booking_inquiries is missing — run supabase/schema.sql in the Supabase SQL editor."
        : error.code === "42501"
          ? "Permission denied — run supabase/schema.sql again or add SUPABASE_SERVICE_ROLE_KEY in Vercel."
          : "Could not save your enquiry. Try phone or email, or contact the site owner.";

    return NextResponse.json(
      { error: hint, code: error.code ?? "insert_failed" },
      { status: 500 },
    );
  }

  const emailResult = await sendBookingNotificationEmail({
    name: row.name,
    email: row.email,
    phone: row.phone,
    event_type: row.event_type,
    event_date: row.event_date,
    message: row.message,
  });

  if (!emailResult.ok) {
    console.error("[booking] Email notification failed:", emailResult.error);
  }

  return NextResponse.json({ ok: true, emailSent: emailResult.ok });
}
