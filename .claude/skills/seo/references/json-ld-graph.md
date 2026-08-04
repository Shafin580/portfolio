# The JSON-LD graphs, node by node

Two builders in [lib/structured-data.ts](../../../../lib/structured-data.ts). Both return a
single `@context` + `@graph`. Read this before changing either — the cross-references are
load-bearing and a node removed in one place usually leaves a dangling `@id` in another.

## Shared identifiers

| Constant | Value | Used by |
|---|---|---|
| `PERSON_ID` | `<SITE_URL>/#person` | every `creator`, `author`, `about` on the homepage |
| `WEBSITE_ID` | `<SITE_URL>/#website` | `isPartOf` on both page types |
| `PAGE_ID` | `<SITE_URL>/#webpage` | the homepage `ProfilePage` |
| `ORG_ID` | `<SITE_URL>/#arits` | the employer `Organization` on the homepage |
| `projectId(p)` | `<SITE_URL>/projects/<slug>#project` | the work node, referenced by `WebPage.about` |
| `entityId(e)` | `<SITE_URL>/#org-<host-slug>` | named organisations; **derived from the URL** so the same org gets the same id on every page |

`entityId` deriving from the URL rather than the name is deliberate: "ARITS Limited"
appears on all eight case studies and must be one entity, not eight.

---

## `buildStructuredData(linkStatus)` — the homepage

Rendered by `app/page.tsx`.

| Node | `@id` | Notes |
|---|---|---|
| `Person` | `#person` | the full profile: `knowsAbout` (all skills), `knowsLanguage`, `address`, `sameAs`, `hasOccupation`, `worksFor` → `#arits` |
| `Occupation` | — | inline on the Person |
| `CollegeOrUniversity` + `EducationalOccupationalCredential` | — | degree and certification |
| `Organization` | `#arits` | the employer |
| `WebSite` | `#website` | `publisher` → `#person` |
| `ProfilePage` | `#webpage` | `about`/`mainEntity` → `#person`, `isPartOf` → `#website` |
| `ItemList` | — | every project via `projectNode()`, position-ordered |
| `FAQPage` | `#faq` | `isPartOf` → `#webpage`; `mainEntity` from the site-wide `faqs` array |

`linkStatus` gates project `url`/`sameAs` — see invariant 4 in the skill.

---

## `buildProjectStructuredData(project, isLive)` — a case-study page

Rendered by `app/projects/[slug]/page.tsx`. A project with no `caseStudy` returns a
single-node graph (defensive; the route never generates for one).

Node order in the graph:

1. **`Person`** — `#person`, a *stub* (name, jobTitle, url). The full profile lives on the
   homepage; repeating it here would duplicate without adding anything.
2. **`Organization` × N** — one per `study.entities`, id from `entityId()`, each with
   `name`, `url`, `sameAs: [url]`.
3. **The work** — `@type` from `project.schemaType`, `@id` from `projectId()`. Carries:
   - `url` → our case-study page (the canonical page *about* the work)
   - `sameAs` → the live client site, when the ping says it is alive
   - `abstract` → `study.overview`
   - `datePublished` / `dateModified`
   - `about` **and** `sponsor` → `{ "@id": entityId(client) }`
   - `mentions` → every other entity by `@id`
   - `citation` → `study.sources`, each a `CreativeWork` with a `publisher` Organization
   - `subjectOf` → `study.externalCaseStudy`, when present
   - `mainEntityOfPage` → `#webpage`
   - `creator` → `#person`
4. **`WebPage`** — `<pageUrl>#webpage`. `about` → the work, `isPartOf` → `#website`,
   `breadcrumb` → `#breadcrumb`, `primaryImageOfPage` → the project screenshot (**not** the
   OG card: `generateImageMetadata` gives it a hashed URL that cannot be constructed here),
   plus `speakable` pointing at `[data-speakable='overview']` and
   `[data-speakable='takeaways']`.
5. **`BreadcrumbList`** — `<pageUrl>#breadcrumb`. Home → Projects → *title*. **Must mirror
   `<BreadcrumbTrail>` on the page item for item.**
6. **`FAQPage`** — `<pageUrl>#faq`, `isPartOf` → `#webpage`, `mainEntity` built from
   `study.faqs` — the same array `<Faq items={study.faqs}>` renders.

### Pairs that must be edited together

| If you change… | You must also change… |
|---|---|
| `BreadcrumbList` items | `<BreadcrumbTrail items={...}>` in the page |
| `study.faqs` | nothing — one array feeds both. That is the point. |
| `speakable.cssSelector` | the matching `data-speakable` attribute in the page |
| `entityId()` derivation | nothing else, but every `@id` changes — verify no dangling refs |
| `project.schemaType` | nothing; but check the new type actually accepts the properties in use |
