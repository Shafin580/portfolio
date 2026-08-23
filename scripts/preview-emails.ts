/**
 * Local renderer for the two contact emails.
 *
 * The templates in `emails/` are only ever seen after they have been sent, which makes
 * "responsive in all viewports" an untestable claim. This writes both of them, against a
 * fixture set chosen to break them, into a gitignored `.email-preview/` and builds an
 * index that frames every render at five widths side by side.
 *
 * It lives in `scripts/` for the same reason `generate-og.tsx` does: nothing here enters
 * the server module graph, so it costs nothing against the Worker's 3 MiB script budget.
 *
 * Run with `pnpm preview:email`, then open `.email-preview/index.html`.
 *
 * **What this cannot show you.** Chrome ignores VML, so the Outlook button is invisible
 * here by design — the `<a>` branch is what renders. Outlook remains a Litmus / Email on
 * Acid check, or a real send.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { contactRequestEmail } from "../emails/contact-request";
import { contactConfirmationEmail } from "../emails/contact-confirmation";
import type { ContactInput } from "../lib/contact-schema";

const OUT_DIR = path.join(process.cwd(), ".email-preview");

/** The widths that actually matter: iPhone SE, iPhone 15, Pro Max, the email column, desktop. */
const WIDTHS = [320, 375, 414, 600, 800] as const;

const LOREM =
  "We need a rebuild of our booking flow. The current one drops about a third of users at " +
  "the payment step and we have never been able to work out why. ";

const fixtures: ReadonlyArray<{ id: string; note: string; data: ContactInput }> = [
  {
    id: "typical",
    note: "Short name, company present, two paragraphs.",
    data: {
      name: "Priya Rahman",
      email: "priya@northline.co",
      company: "Northline Studio",
      projectType: "web-app",
      description:
        "We are replacing an internal tool that three teams depend on.\n\nThe deadline is the end of Q3 and the current stack is a PHP monolith nobody wants to touch. Happy to share the repo under NDA.",
    },
  },
  {
    id: "minimal",
    note: "No company, one line. Proves the optional row disappears rather than rendering blank.",
    data: {
      name: "Sam",
      email: "sam@example.com",
      projectType: "landing-page",
      description: "Need a one-page site for a product launch in six weeks.",
    },
  },
  {
    id: "stress",
    note: "60-char name, 5000-char description, a 120-char unbreakable URL, hard line breaks.",
    data: {
      name: "Alexandria Konstantinopoulos-Wetherby the Third of Kent",
      email:
        "alexandria.konstantinopoulos-wetherby@a-very-long-corporate-domain-name.example.co.uk",
      company: "Konstantinopoulos-Wetherby Advanced Manufacturing Holdings International",
      projectType: "fullstack",
      description:
        LOREM.repeat(28).slice(0, 4700) +
        "\n\nReference: " +
        "https://staging.internal.example.com/reports/2026/q3/checkout-funnel-analysis-final-v4-revised.pdf" +
        "\n\nLine one\nLine two\nLine three",
    },
  },
  {
    id: "hostile",
    note: "Markup and quotes in every field. Every one must render as visible text, never execute.",
    data: {
      name: `O'Brien & Sons <script>alert(1)</script>`,
      email: `"><img src=x onerror=alert(2)>@example.com`,
      company: `<b>Bold & "Quoted"</b> <img src=x onerror=alert(3)>`,
      projectType: "other",
      description:
        `</div><script>alert('xss')</script>\n\nAlso: 5 > 3 && 2 < 4, "quoted", 'single', ` +
        `and an entity that must survive: &amp; stays &amp;.`,
    },
  },
];

const templates = [
  { id: "request", label: "Received (to Shafin)", render: contactRequestEmail },
  { id: "confirmation", label: "Reply (to the visitor)", render: contactConfirmationEmail },
] as const;

/**
 * Force the dark-mode block on.
 *
 * A parent page cannot impose `prefers-color-scheme` on an iframe, so the dark render is
 * a second copy of the same HTML with that one media query unconditioned. Nothing else is
 * touched, so what you see is exactly the declarations the real dark rules carry.
 */
function forceDark(html: string): string {
  return html.replace("@media (prefers-color-scheme: dark) {", "@media all {");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildIndex(
  renders: ReadonlyArray<{
    key: string;
    fixture: string;
    template: string;
    note: string;
    subject: string;
  }>,
): string {
  const tabs = renders
    .map(
      (r, i) =>
        `<button class="tab${i === 0 ? " active" : ""}" data-key="${r.key}">` +
        `<span class="t-fix">${escapeHtml(r.fixture)}</span>` +
        `<span class="t-tpl">${escapeHtml(r.template)}</span></button>`,
    )
    .join("");

  const panes = renders
    .map(
      (r, i) => `<section class="pane${i === 0 ? " active" : ""}" data-key="${r.key}">
      <p class="note"><strong>${escapeHtml(r.fixture)}</strong> — ${escapeHtml(r.note)}</p>
      <p class="subject">Subject: <code>${escapeHtml(r.subject)}</code> · <a href="${r.key}.txt" target="_blank">plain-text alternative</a></p>
      <div class="frames">
        ${WIDTHS.map(
          (w) => `<figure style="width:${w}px">
          <figcaption>${w}px</figcaption>
          <iframe data-src="${r.key}" width="${w}" height="900" loading="lazy" title="${escapeHtml(r.fixture)} at ${w}px"></iframe>
        </figure>`,
        ).join("")}
      </div>
    </section>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact email previews</title>
<style>
  :root { color-scheme: light dark; --bg:#f6f7f9; --fg:#111827; --mut:#6b7280; --line:#e5e7eb; --card:#fff; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0b0f19; --fg:#f3f4f6; --mut:#9ca3af; --line:#1f2937; --card:#111827; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg);
         font:14px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
  header { position:sticky; top:0; z-index:2; background:var(--card);
           border-bottom:1px solid var(--line); padding:12px 16px; }
  h1 { margin:0 0 4px; font-size:15px; }
  .hint { margin:0; color:var(--mut); font-size:12px; }
  .bar { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-top:10px; }
  .tab { display:flex; flex-direction:column; gap:1px; text-align:left; cursor:pointer;
         background:transparent; color:inherit; border:1px solid var(--line);
         border-radius:8px; padding:5px 9px; font:inherit; font-size:12px; }
  .tab.active { border-color:#2563eb; box-shadow:inset 0 0 0 1px #2563eb; }
  .t-tpl { color:var(--mut); font-size:11px; }
  .scheme { margin-left:auto; display:flex; gap:6px; }
  .scheme button { cursor:pointer; border:1px solid var(--line); background:transparent;
                   color:inherit; border-radius:8px; padding:6px 12px; font:inherit; font-size:12px; }
  .scheme button.active { border-color:#2563eb; box-shadow:inset 0 0 0 1px #2563eb; }
  .pane { display:none; padding:16px; }
  .pane.active { display:block; }
  .note { margin:0 0 2px; }
  .subject { margin:0 0 12px; color:var(--mut); font-size:12px; }
  code { font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; }
  .frames { display:flex; gap:16px; align-items:flex-start; overflow-x:auto; padding-bottom:12px; }
  figure { margin:0; flex:0 0 auto; }
  figcaption { color:var(--mut); font-size:11px; margin-bottom:4px; }
  iframe { border:1px solid var(--line); border-radius:10px; background:#fff; display:block; }
  body[data-scheme="dark"] iframe { background:#030712; }
</style>
</head>
<body data-scheme="light">
<header>
  <h1>Contact email previews</h1>
  <p class="hint">Chrome ignores VML, so the Outlook button does not appear here — that branch needs Litmus or a real send. Everything else is what the client sees.</p>
  <div class="bar">
    ${tabs}
    <span class="scheme">
      <button data-scheme="light" class="active">Light</button>
      <button data-scheme="dark">Dark</button>
    </span>
  </div>
</header>
${panes}
<script>
  var body = document.body;
  function load() {
    var scheme = body.dataset.scheme;
    var pane = document.querySelector('.pane.active');
    if (!pane) return;
    pane.querySelectorAll('iframe').forEach(function (f) {
      var want = f.dataset.src + (scheme === 'dark' ? '.dark' : '') + '.html';
      if (f.getAttribute('src') !== want) f.setAttribute('src', want);
    });
  }
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.pane').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var pane = document.querySelector('.pane[data-key="' + tab.dataset.key + '"]');
      if (pane) pane.classList.add('active');
      load();
    });
  });
  document.querySelectorAll('.scheme button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.scheme button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      body.dataset.scheme = b.dataset.scheme;
      load();
    });
  });
  load();
</script>
</body>
</html>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const renders: Array<{
    key: string;
    fixture: string;
    template: string;
    note: string;
    subject: string;
  }> = [];

  for (const fixture of fixtures) {
    for (const template of templates) {
      const key = `${fixture.id}-${template.id}`;
      const out = template.render(fixture.data);

      await writeFile(path.join(OUT_DIR, `${key}.html`), out.html, "utf8");
      await writeFile(path.join(OUT_DIR, `${key}.dark.html`), forceDark(out.html), "utf8");
      await writeFile(path.join(OUT_DIR, `${key}.txt`), out.text, "utf8");

      renders.push({
        key,
        fixture: fixture.id,
        template: template.label,
        note: fixture.note,
        subject: out.subject,
      });

      const bytes = Buffer.byteLength(out.html, "utf8");
      // Gmail clips a message past 102 KB and hides the rest behind "View entire message".
      const clip = bytes > 102_400 ? "  <- OVER GMAIL'S 102 KB CLIP THRESHOLD" : "";
      console.log(`  ${key.padEnd(26)} ${String(bytes).padStart(7)} bytes${clip}`);
    }
  }

  await writeFile(path.join(OUT_DIR, "index.html"), buildIndex(renders), "utf8");
  console.log(`\nWrote ${renders.length * 3 + 1} files to .email-preview/`);
  console.log("Open .email-preview/index.html");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
