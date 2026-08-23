import { profile } from "@/lib/portfolio-data";
import { projectTypeLabel, type ContactInput } from "@/lib/contact-schema";
import {
  accentRule,
  band,
  card,
  COLORS,
  emailDocument,
  esc,
  field,
  hairline,
  mailtoParam,
  meta,
  nl2br,
  oneLine,
  panel,
} from "./shared";

/**
 * The email Shafin receives when someone submits the contact form.
 *
 * Every value here arrives from a public form, so all of it is untrusted input and
 * **every interpolation goes through `esc()`** — see the note at the top of `shared.ts`.
 *
 * Laid out for scanning rather than reading: the sender is the headline, the reply button
 * is above the fold, and the description — the one part that has to be read properly —
 * gets the filled panel. Its counterpart is `contact-confirmation.ts`; the two share
 * `shared.ts` so they stay one system.
 */
export function contactRequestEmail(data: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const type = projectTypeLabel(data.projectType);
  const name = oneLine(data.name);
  const replyHref = `mailto:${mailtoParam(data.email)}?subject=${mailtoParam(`Re: your project enquiry — ${type}`)}`;

  /**
   * The button text is drawn by VML in Outlook, where it is a fixed-width box that cannot
   * wrap, so the label has to stay short whatever the visitor typed. First word only,
   * clamped — a 120-character name is within what the schema allows.
   */
  const firstName = name.split(" ")[0].slice(0, 18) || "sender";

  const html = emailDocument({
    title: "New project enquiry",
    preview: `${name} — ${type}. Reply goes straight back to them.`,
    body:
      band({
        eyebrow: "New project enquiry",
        heading: esc(data.name),
        // An explicit anchor, so iOS Mail does not auto-detect the address and repaint it
        // in its own blue — which on this near-black band is unreadable.
        sub: `<a href="mailto:${mailtoParam(data.email)}" class="breakable" style="color:${COLORS.dark.inkMuted};text-decoration:none;">${esc(data.email)}</a>`,
        action: { href: replyHref, label: `Reply to ${firstName}` },
      }) +
      card(
        field("Project type", esc(type)) +
          field("Company", data.company ? esc(data.company) : undefined, "Not given") +
          hairline() +
          panel("Project description", nl2br(esc(data.description))) +
          accentRule() +
          meta(
            `Sent from the contact form on ${esc(profile.name)}&rsquo;s portfolio. Replying to this message goes straight back to the sender.`,
          ),
      ),
  });

  const text = [
    `New project enquiry — ${name}`,
    ``,
    `Reply to:     ${data.email}`,
    `Project type: ${type}`,
    `Company:      ${data.company || "Not given"}`,
    ``,
    `Description:`,
    data.description,
    ``,
    `Sent from the contact form on ${profile.name}'s portfolio.`,
  ].join("\n");

  return {
    subject: oneLine(`Project enquiry — ${name} (${type})`),
    html,
    text,
  };
}
