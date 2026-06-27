/**
 * Secure API client for OutreachAI
 * 
 * - API key is NEVER exposed to the client bundle.
 * - All AI calls go through a server-side API route (/api/generate).
 * - Input is validated before the request is sent.
 * - Responses are typed and errors are surfaced cleanly.
 */

export type GenerateMode = "upwork" | "linkedin" | "creator";

export interface GeneratePayload {
  mode: GenerateMode;
  fields: Record<string, string>;
}

export interface GenerateResult {
  text: string;
}

export async function generateOutreach(payload: GeneratePayload): Promise<GenerateResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Server error ${response.status}`);
  }

  return response.json() as Promise<GenerateResult>;
}
