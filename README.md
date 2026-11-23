# Alex Georgiev — Portfolio

**The Operator's Ledger.** Personal site of Alex Georgiev, AI & automation developer, founder of AGility, and a high-school student at VSCPI Burgas.
It is built for three readers at once:

1. **Companies hiring** for AI, automation or Python. They get the work, the stack, a CV in one click and contact details.
2. **Businesses** that could become AGility clients. They get services in plain language, the process, a booking link and a contact form.
3. **Schools and programmes.** They get education, languages, certificates, competitions and a Europass-format CV. No section is labelled for any one audience.

Bilingual: `/en` and `/bg`.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint
```

> **Windows dev tip:** Turbopack's file watcher sometimes misses edits to `src/app/globals.css`.
> If a style change doesn't show up in `npm run dev`, stop the server, delete `.next/dev` and start it again.
> Production builds are not affected.

## Where things live

| What | File |
|---|---|
| Identity, email, booking link, socials | `src/content/site.ts` |
| Projects (Selected work) | `src/content/projects.ts` |
| Case studies (`/work/[slug]`) | `src/content/case-studies.ts` |
| AGility services | `src/content/services.ts` |
| Timeline (the path so far) | `src/content/milestones.ts` |
| School, languages, certificates | `src/content/education.ts` |
| Stack marquee + monogram words | `src/content/stack.ts` |
| All other copy, EN + BG | `messages/en.json`, `messages/bg.json` |
| Design tokens (colours, type, motion) | `src/app/globals.css` |

**Placeholders.** Anything written as `[[LIKE THIS]]` is unfilled. In local dev it shows as a dashed ember marker. In production it's hidden, along with any label it would leave dangling. A project whose summary is still a placeholder is hidden entirely, including its row, palette entry, sitemap entry and case page. Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1` to see them in a production build.
To list every remaining one:

```bash
grep -rn "\[\[" src messages
```

---

## Placeholders to fill (true values only)

Honesty rules from the brief still apply. Never invent metrics, clients, results or years of experience.
The railings client stays anonymised as "Unified Enquiry Engine", with no brand, logo or domain anywhere.

### Identity and contact — `src/content/site.ts`
- [ ] `[[EMAIL]]`: your email. It turns on copy-to-clipboard, the palette action and JSON-LD.
- [ ] `[[CAL_LINK]]`: your booking link (Cal.com, Calendly…). It turns on every "Book a call" button.
- [ ] **Portrait:** add `public/alex.jpg`, portrait orientation, at least 1200px tall. It switches on automatically with the duotone treatment.

### Projects — `src/content/projects.ts`
- [ ] `[[STACK]]` on each project (real technologies only).
- [ ] SupportAI, AI Chatbot, AI Data Analyst, Promo Film: `[[ONE-LINE DESCRIPTION]]`, `[[WHAT YOU BUILT]]`, `[[URL]]` (live), `[[GITHUB]]` (code), `[[DETAILS]]`.
- [ ] Scamly: `[[WHAT YOU PERSONALLY BUILT ON SCAMLY]]`, `[[TEAMMATE]]`, `[[GITHUB]]`, `[[RESULT]]` (after December 2026).
- [ ] IRO robot: `[[YEAR]]`, `[[RESULT]]`.
- [ ] **Status chips:** four projects say **Live**. Change to `"demo"` or `"internal"` if a project isn't actually public yet.
- [ ] `[[MORE DEMOS]]`: copy an entry to add more.
- [ ] **Media:** add `public/work/<slug>.mp4`, `.webm` and a poster image. Then set `media: { mp4, webm, poster, alt }`. Rows and case-study heroes switch from the "media pending" cover to your video automatically.

### Case studies — `src/content/case-studies.ts`
- [ ] Unified Enquiry Engine: `[[TIMELINE]]`, `[[STATUS]]`, `[[METRIC: time to first reply, before → after]]`, `[[NEXT STEP]]`.
  **Read every sentence.** The problem, approach and three "key decisions" were written from your brief; check that they match what you actually built.
- [ ] Scamly: `[[APPROACH]]`, `[[ARCHITECTURE]]`, `[[DETECTION]]` (the diagram node), `[[DECISION 1/2]]`, `[[RESULT]]`, `[[NEXT STEP]]`.

### Services — `src/content/services.ts`
- [ ] `[[METRIC]]` for each service. Leave it as a placeholder until you have a true number from a real client.

### Education — `src/content/education.ts` and `messages/*.json → studies`
- [ ] `[[YEARS]]` (e.g. 2023 — 2027) and `[[CLASS]]` (e.g. 11th grade). **No grades, on purpose.**
- [ ] `[[CEFR]]`: your English level (A1–C2) and, if any, `[[CERTIFICATE]]` (e.g. Cambridge B2, 2026).
- [ ] `[[OTHER LANGUAGE]]`, or delete that row.
- [ ] `[[CERTIFICATES]]`: name, issuer, year. Delete if none.
- [ ] `[[OTHER SUBJECTS]]` in your focus modules.
- [ ] `studies.docs.refs`: `[[REFERENCE: teacher name and subject]]` (optional).

### Elsewhere in `messages/*.json`
- [ ] `proof.facts[0]`: `[[N]]` shipped demos (count only what's live or on GitHub).
- [ ] `about.learningList`, `about.toolsList`: `[[OTHER]]`.
- [ ] `cv.agilityWhen`: `[[START YEAR]]`.
- [ ] `milestones.ts`: `[[YEAR]]` for VSCPI, AGility and IRO.

### Regenerate the CV PDF after filling things in
`public/cv.pdf` is generated from the `/en/cv` page. After updating content:
1. `npm run build && npm start`
2. Open `http://localhost:3000/en/cv` and click **Print / Save as PDF**.
3. Choose A4, margins **Default**, **Background graphics** on, then save over `public/cv.pdf`.

The `/cv/europass` page prints the same way.

---

## Contact form (Resend)

The business form on `/#contact` posts to a server action (`src/app/actions/contact.ts`). It uses:
- zod validation.
- A honeypot field and a 2.5s time trap.
- An in-memory rate limit: 3 messages per 10 minutes per IP.

It sends a plain-text email through [Resend](https://resend.com) (free tier).
Until it's configured, the form politely tells visitors to email you instead.

```bash
cp .env.example .env.local
```

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | from resend.com → API Keys |
| `CONTACT_TO_EMAIL` | where enquiries should arrive (your inbox) |
| `CONTACT_FROM_EMAIL` | `Portfolio <onboarding@resend.dev>` until you verify a domain in Resend, then e.g. `Portfolio <hello@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://alexgeorgiev.dev` (canonical URLs, sitemap, OG, JSON-LD) |

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. The framework is detected as Next.js; no build settings are needed.
3. Under **Settings → Environment Variables**, add the four variables above for Production (and Preview if you like).
4. Deploy. Every push to `main` redeploys. The footer shows the commit SHA as `build abc1234`.
5. Optional: **Settings → Domains** to add a custom domain, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

With the CLI:

```bash
npm i -g vercel
vercel link
vercel env add RESEND_API_KEY production   # repeat for each variable
vercel --prod
```

---

## What's in it

- **Next.js 16** (App Router, Cache Components, Partial Prefetching), **TypeScript strict**, **Tailwind CSS v4**.
- **next-intl** with `/en` + `/bg`, using `next/root-params`. Browser language is detected on the first visit only, then the choice is remembered.
- **Signal Field:** a custom raw-WebGL particle shader (no three.js). All motion runs in one vertex shader. It lazy-loads after first paint, pauses off-screen, caps DPR at 1.5, and falls back to a server-rendered SVG poster for reduced motion and low-power devices.
- **GSAP + ScrollTrigger** for the ledger choreography, process rail and timeline. **Lenis** smooth scroll on desktop only. **Motion** for UI micro-interactions. React **`<ViewTransition>`** morphs a dossier row into its case-study hero.
- **⌘K command palette** (cmdk, lazy-loaded on first use), status island, data trail over Selected work, and a lightly styled system cursor (pure CSS, falls back to the normal cursor).
- **SEO:** localized metadata, hreflang, sitemap, robots, JSON-LD `Person` + `Organization`, dynamic OG images per page and language (`next/og`).
- **Accessibility:** keyboard navigable, visible ember focus rings, AA contrast, `prefers-reduced-motion` respected everywhere.

### Lighthouse (production build, local)

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/en`, mobile | 96 | 100 | 100 | 100 |
| `/en`, desktop | 99 | 100 | 100 | 100 |
| `/bg`, mobile | 94 | 100 | 100 | 100 |
| `/en/work/unified-enquiry-engine`, mobile | 100 | 100 | 100 | 100 |
