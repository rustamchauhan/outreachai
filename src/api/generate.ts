/**
 * Server-side API route: POST /api/generate
 *
 * The AI API key is read from env vars here (server-only).
 * It is NEVER sent to the client bundle.
 *
 * Security:
 *  - Input size capped to prevent prompt injection via huge payloads
 *  - Only known modes are accepted
 *  - Fields are sanitized before being included in the prompt
 */

import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

const MAX_FIELD_LENGTH = 2000;
const ALLOWED_MODES = ["upwork", "linkedin", "creator"] as const;
type Mode = (typeof ALLOWED_MODES)[number];

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.slice(0, MAX_FIELD_LENGTH).trim();
}

function buildPrompt(mode: Mode, fields: Record<string, string>): string {
  if (mode === "upwork") {
    return `You are an expert freelance proposal writer. Write a concise, compelling Upwork/Fiverr proposal.

Job Description: ${fields.job}
Applicant Name: ${fields.name}
Years of Experience: ${fields.years}
Skills: ${fields.skills}
Desired Tone: ${fields.tone}
Personal Touch / Observation: ${fields.touch}

Write a proposal (max 200 words). Be direct. Start with a specific hook, not "I".`;
  }

  if (mode === "linkedin") {
    return `You are an expert at LinkedIn outreach. Write a short, human-sounding message.

Goal: ${fields.goal}
Recipient Name & Title: ${fields.recipient}
Recipient Bio: ${fields.bio}
Sender Background: ${fields.background}
What sender wants: ${fields.want}
Message Format: ${fields.format}

Write a message (max 120 words). Sound human, not salesy. No generic openers.`;
  }

  return `You are an expert at brand-creator collaboration pitches. Write a warm, specific pitch.

Pitch Type: ${fields.pitch}
Creator Name & Niche: ${fields.creator}
Audience & Content Style: ${fields.audience}
Brand: ${fields.brand}
Offer: ${fields.offer}
Why It's A Good Fit: ${fields.fit}
Tone: ${fields.tone}

Write a pitch (max 160 words). Be genuine. No empty flattery.`;
}

export const APIRoute = createAPIFileRoute("/api/generate")({
  POST: async ({ request }) => {
    let body: { mode?: unknown; fields?: unknown };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!ALLOWED_MODES.includes(body.mode as Mode)) {
      return json({ error: "Invalid mode" }, { status: 400 });
    }
    const mode = body.mode as Mode;

    if (typeof body.fields !== "object" || body.fields === null || Array.isArray(body.fields)) {
      return json({ error: "Invalid fields" }, { status: 400 });
    }
    const sanitizedFields = Object.fromEntries(
      Object.entries(body.fields as Record<string, unknown>).map(([k, v]) => [k, sanitize(v)])
    );

    const prompt = buildPrompt(mode, sanitizedFields);

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        console.error("Anthropic error", res.status, await res.text());
        return json({ error: "AI service error. Please try again." }, { status: 502 });
      }
      const data = await res.json();
      return json({ text: data?.content?.[0]?.text ?? "" });
    }

    if (openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        console.error("OpenAI error", res.status, await res.text());
        return json({ error: "AI service error. Please try again." }, { status: 502 });
      }
      const data = await res.json();
      return json({ text: data?.choices?.[0]?.message?.content ?? "" });
    }

    return json(
      { error: "No AI API key configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to your .env file." },
      { status: 503 }
    );
  },
});
