import type { FaqItem } from "@/components/FaqAccordion";
import { createServerSupabase } from "@/lib/supabase/server";

export type FaqRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

export function mapRow(row: Record<string, unknown>): FaqRecord {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    question: String(row.question),
    answer: String(row.answer),
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
  };
}

export function toFaqItem(faq: FaqRecord): FaqItem {
  return {
    question: faq.question,
    answer: faq.answer,
  };
}

export async function fetchPublishedFaqs(): Promise<FaqRecord[] | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: true });

  if (error || !data) return null;
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function fetchAllFaqsAdmin(): Promise<FaqRecord[] | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: true });

  if (error || !data) return null;
  return data.map((row) => mapRow(row as Record<string, unknown>));
}
