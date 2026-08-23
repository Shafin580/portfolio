import { NextResponse } from "next/server";
import { contactRequestEmail } from "@/emails/contact-request";
import { contactConfirmationEmail } from "@/emails/contact-confirmation";
import { contactSchema } from "@/lib/contact-schema";
import { profile } from "@/lib/portfolio-data";

/**
 * Contact form endpoint.
 *
 * Everything reaching this handler is untrusted: the form is public and the route can be
 * POSTed to directly, so client-side validation counts for nothing here. Order of
 * operations is deliberate — cheapest rejections first, and no email is sent until every
 * check has passed.
 *
 *   1. config      — refuse early if the keys are missing, so the form can fall back
 *   2. shape       — re-parse the raw body with the shared zod schema
 *   3. honeypot    — a filled hidden field is a bot; answer 200 so it learns nothing
 *   4. rate limit  — per IP, before spending a Turnstile call
 *   5. Turnstile   — verified server-side against Cloudflare, never trusted from the client
 *   6. send        — `to` is always the configured address, never taken from the payload
 *   7. confirm     — a copy back to the visitor, best-effort and never fatal
 *
 * Do not reorder, skip, or make any of these conditional.
 *
 * **Delivery goes over Resend's REST API by hand, not through the `resend` SDK.** The SDK
 * plus `@react-email/components` measured 1,791,420 bytes gzipped inside the compiled
 * Cloudflare Worker — more than half of the free plan's entire 3 MiB script budget, for
 * two `POST`s and two static-shaped emails. `fetch` costs nothing. If you reinstate
 * either package, re-measure before deploying:
 *
 *   pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
 *   find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c
 */

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_SEND_URL = "https://api.resend.com/emails";

/**
 * In-memory, per-instance rate limit. Adequate for a single-origin portfolio; it resets
 * on deploy and does not coordinate across isolates. On Cloudflare Workers the effective
 * window is shorter and less reliable than on Node — **Turnstile is the real gate.** If
 * this ever needs to hold at scale, move it to a shared store rather than raising the
 * limit here.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  // Cloudflare sets this on every request that reaches the Worker and it cannot be
  // spoofed by the client, so it wins over the forwarded headers below.
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // A verification outage must fail closed — an unverified submission is not accepted.
    return false;
  }
}

interface ResendPayload {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * One `POST` to Resend's REST API.
 *
 * Field names are the REST ones (`reply_to`), not the SDK's camelCase (`replyTo`) — the
 * API silently ignores an unknown key, so a camelCase slip here would drop the reply-to
 * header with no error anywhere.
 *
 * Never throws for a non-2xx: the caller decides whether a failure is fatal, and the two
 * sends differ on exactly that.
 */
async function sendEmail(
  apiKey: string,
  payload: ResendPayload,
): Promise<{ ok: boolean; status: number; detail?: string }> {
  const res = await fetch(RESEND_SEND_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) return { ok: true, status: res.status };

  // Read the body for the log only. It never reaches the client — an upstream error
  // message is not something a form submitter should be shown.
  const detail = await res.text().catch(() => "");
  return { ok: false, status: res.status, detail: detail.slice(0, 500) };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Not configured yet. Say so plainly so the form can show its mailto fallback rather
  // than looking broken.
  if (!apiKey || !to || !from || !process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    // Deliberately opaque: the field-level messages are already on the client, and
    // echoing the parsed payload back would hand a prober a validation oracle.
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: report success so a bot gets no signal that it was caught.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!(await verifyTurnstile(data.turnstileToken ?? "", ip))) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  try {
    const notification = contactRequestEmail(data);
    const sent = await sendEmail(apiKey, {
      from: `${profile.name} Portfolio <${from}>`,
      // Always the configured recipient. Never `data.email` — that would make this an
      // open relay that anyone could use to send mail to anyone.
      to: [to],
      reply_to: data.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (!sent.ok) {
      console.error("[contact] resend error", sent.status, sent.detail);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    /**
     * The visitor's own confirmation.
     *
     * This is the one send whose recipient DOES come from the payload, which is the whole
     * reason it sits last and behind every check above: Turnstile and the per-IP rate
     * limit are what stop it being a way to mail arbitrary strangers from this domain. It
     * stays a reply to a form the recipient just submitted — nothing about it is a
     * general-purpose send.
     *
     * Best-effort by design. The notification is the one that matters; if this fails the
     * request still succeeded, so it is logged and swallowed rather than turned into a
     * 502 that would make the visitor submit the form twice.
     */
    try {
      const confirmation = contactConfirmationEmail(data);
      const copy = await sendEmail(apiKey, {
        from: `${profile.name} <${from}>`,
        to: [data.email],
        reply_to: to,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      });
      if (!copy.ok) {
        console.error("[contact] confirmation not sent", copy.status, copy.detail);
      }
    } catch (err) {
      console.error("[contact] confirmation not sent", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
