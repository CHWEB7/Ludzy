import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  event_type?: string;
  event_date?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, event_type, event_date, message } = body;

  if (!name?.trim() || !email?.trim() || !event_type?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.json(
      { error: "Server is missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const supabase = createClient(url, anon);

  const row = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    event_type: event_type.trim(),
    event_date: event_date?.trim() || null,
    message: message.trim(),
  };

  const { error } = await supabase.from("booking_inquiries").insert(row);

  if (error) {
    console.error("[booking] Supabase error", error);
    return NextResponse.json(
      { error: "Could not save enquiry. Check Supabase table and RLS policies." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
