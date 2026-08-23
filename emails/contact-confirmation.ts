import { profile } from "@/lib/portfolio-data";
import { projectTypeLabel, type ContactInput } from "@/lib/contact-schema";
import { SITE_URL } from "@/lib/site";
import {
  accentRule,
  band,
  button,
  card,
  COLORS,
  emailDocument,
  esc,
  hairline,
  meta,
  nl2br,
  panel,
  paragraph,
} from "./shared";

/**
 * The auto-reply the visitor receives.
 *
 * Its job is reassurance, not information: confirm the message landed, say when a reply
 * is coming, and give one route to follow up. It quotes the visitor's own description
 * back so they can see exactly what was received.
 *
 * This is the one send whose recipient comes from the request payload, which is why the
 * route sends it **last**, behind Turnstile and the rate limit, and treats a failure as
 * non-fatal. See `app/api/contact/route.ts`.
 *
 * Same escaping rule as its counterpart: every interpolated request value goes through
 * `esc()`.
 */
export function contactConfirmationEmail(data: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const type = projectTypeLabel(data.projectType).toLowerCase();
  const firstName = profile.name.split(" ")[0];

  const html = emailDocument({
    title: "Message received",
    // Deliberately not the subject line again — the preview is a second line of
    // information in the inbox, and repeating the subject wastes it.
    preview: "Reply within 24 hours. Here is what you sent.",
    body:
      band({
        eyebrow: "Message received",
        heading: esc(profile.name),
        sub: esc(profile.title),
      }) +
      card(
        paragraph(
          `Hi ${esc(data.name)} — thanks for getting in touch about your ${esc(type)}. Your message has landed and I read every one myself. Expect a reply within 24 hours.`,
        ) +
          hairline() +
          panel("What you sent", nl2br(esc(data.description))) +
          button(esc(SITE_URL), "View portfolio") +
          accentRule() +
          meta(
            `Need to add something? Reply to this email, or reach me directly at <a class="link" href="mailto:${esc(profile.email)}" style="color:${COLORS.primary};text-decoration:underline;">${esc(profile.email)}</a>.`,
          ),
      ),
  });

  const text = [
    `Hi ${data.name},`,
    ``,
    `Thanks for getting in touch about your ${type}. Your message has landed and I read`,
    `every one myself. Expect a reply within 24 hours.`,
    ``,
    `What you sent:`,
    data.description,
    ``,
    `— ${firstName}`,
    `${SITE_URL}`,
    `${profile.email}`,
  ].join("\n");

  return {
    subject: `Thanks — your enquiry reached ${profile.name}`,
    html,
    text,
  };
}
