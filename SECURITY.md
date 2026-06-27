# OutreachAI — Security Notes

## What was fixed in this version

### 🔑 API Key Exposure (Critical)
**Before:** The generator page called the AI API directly from the browser, 
meaning the API key would have to be bundled into the client JavaScript — 
visible to anyone who inspects the page.

**After:** All AI calls go through a server-side route (`src/api/generate.ts`). 
The key lives in an environment variable (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) 
and is never sent to the browser.

### 🛡️ Input Sanitization
**Before:** User form inputs were interpolated directly into template strings 
and sent as-is, with no length caps.

**After:** All fields are capped at 2,000 characters and trimmed server-side 
before being included in the AI prompt. Only known field names reach the prompt.

### 🔒 Auth Forms (Non-functional → Functional stubs)
**Before:** Login and signup forms called `e.preventDefault()` and did nothing — 
there was no auth at all.

**After:** Forms call proper async handlers in `src/lib/auth.ts`. Stub implementations 
throw clear errors. Swap in Supabase / Clerk / Auth.js by filling in the TODOs.

### 🔐 Password Validation
**Before:** No password policy was enforced anywhere.

**After:** `validatePassword()` in `src/lib/auth.ts` requires ≥8 chars, 1 uppercase 
letter, and 1 number. Error is shown inline on the signup form.

### 📦 Rate Limit Persistence
**Before:** The free-generation counter was React state — it reset every page 
refresh, making the limit trivially bypassable.

**After:** The counter is stored in `localStorage` via `src/lib/rateLimit.ts`, 
so it persists across refreshes. **Enforce the limit server-side per user account** 
for production — client-side is UX only.

### ❌ Error Handling
**Before:** No error state in the generator — a failed API call would silently 
leave the spinner running forever.

**After:** Errors from the API route are caught and displayed inline in the output panel.

## What still needs to be done before launch

1. **Wire up real auth** — fill in `src/lib/auth.ts` with Supabase, Clerk, or similar.
2. **Server-side rate limiting** — enforce per-user generation limits in `src/api/generate.ts` 
   by checking the authenticated user's usage in your database.
3. **Payments** — connect Stripe or LemonSqueezy to the pricing page.
4. **Content Security Policy** — add a CSP header via Nitro middleware.
5. **HTTPS** — ensure your deployment enforces HTTPS (most platforms do this by default).
