"use client";

import { useState, type FormEvent } from "react";

export function useEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let json: { error?: string } = {};
      try {
        json = (await response.json()) as { error?: string };
      } catch {
        if (!response.ok) {
          throw new Error("Could not send your enquiry. Please try again or call us.");
        }
      }

      if (!response.ok) {
        throw new Error(json.error ?? "Could not send your enquiry. Please try again.");
      }

      setSucceeded(true);
      form.reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not send your enquiry. Please try again or contact us by phone.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, succeeded, error, handleSubmit };
}
