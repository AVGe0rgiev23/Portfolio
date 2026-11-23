import { SHOW_PLACEHOLDERS, filled, type L } from "./types";

/**
 * Selected work. Order here = order on the site.
 *
 * Honesty rules:
 * - Never invent metrics, clients or results. Use [[METRIC: …]] / [[RESULT]] until a number is true.
 * - The railings client is anonymised. No brand name, logo or domain — anywhere, including alt text.
 */

export type ProjectStatus = "live" | "production" | "competition" | "internal" | "demo";

export type Project = {
  slug: string;
  name: L;
  /** Client / context type, shown in the ledger row. */
  kind: L;
  year: string;
  stack: string[];
  status: ProjectStatus;
  /** One or two sentences. What it is, for whom. */
  summary: L;
  /** Your role in one line. */
  role: L;
  /** What you personally built — kept separate from teammates' work. */
  built: L;
  team: L;
  links: { live?: string; code?: string };
  media?: {
    poster?: string; // /public path, 16:10
    webm?: string;
    mp4?: string;
    alt: L;
  };
  /** Projects with a full /work/[slug] case study (Phase 4). */
  caseStudy?: boolean;
};

export const projects: Project[] = [
  {
    slug: "unified-enquiry-engine",
    name: { en: "Unified Enquiry Engine", bg: "Unified Enquiry Engine" },
    kind: {
      en: "Railings & balustrade manufacturer · 3 offices",
      bg: "Производител на парапети · 3 офиса",
    },
    year: "2026",
    stack: ["[[STACK]]"],
    status: "demo",
    summary: {
      en: "One real-time inbox for web form, email, Viber, Facebook and missed calls. AI extracts product, dimensions, city and urgency, drafts a reply in seconds and routes the lead to the right office: Sofia, Varna or Burgas.",
      bg: "Една входяща кутия в реално време за уеб форма, имейл, Viber, Facebook и пропуснати обаждания. AI извлича продукт, размери, град и спешност, подготвя отговор за секунди и насочва запитването към правилния офис: София, Варна или Бургас.",
    },
    role: { en: "Solo: scoping, architecture, build", bg: "Сам: обхват, архитектура, разработка" },
    built: {
      en: "Everything: channel integrations (real Viber bot, Meta test page), the LLM extraction pipeline, routing rules and the live dashboard.",
      bg: "Всичко: интеграциите с каналите (реален Viber бот, тестова Meta страница), LLM pipeline-а за извличане, правилата за насочване и live таблото.",
    },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: {},
    media: {
      alt: {
        en: "Dashboard showing enquiries from five channels merged into one inbox, each tagged with product, city and urgency",
        bg: "Табло със запитвания от пет канала, обединени в една кутия, всяко с продукт, град и спешност",
      },
    },
    caseStudy: true,
  },
  {
    slug: "scamly",
    name: { en: "Scamly", bg: "Scamly" },
    kind: {
      en: "National IT Tournament “John Atanasov” · Distributed Applications",
      bg: "Национален ИТ турнир „Джон Атанасов“ · Разпределени приложения",
    },
    year: "2026",
    stack: ["[[STACK]]"],
    status: "competition",
    summary: {
      en: "Phone-scam protection for older people and the families who look out for them. Competing at the National IT Tournament “John Atanasov”, Sofia, December 2026. Result: [[RESULT]].",
      bg: "Защита от телефонни измами за възрастни хора и семействата, които се грижат за тях. Участва в Националния ИТ турнир „Джон Атанасов“, София, декември 2026. Резултат: [[RESULT]].",
    },
    role: { en: "Co-developer · team of 2", bg: "Съразработчик · екип от двама" },
    built: { en: "[[WHAT YOU PERSONALLY BUILT ON SCAMLY]]", bg: "[[КАКВО ИЗГРАДИ ЛИЧНО В SCAMLY]]" },
    team: { en: "Alex Georgiev + [[TEAMMATE]]", bg: "Алекс Георгиев + [[СЪОТБОРНИК]]" },
    links: { code: "[[GITHUB]]" },
    media: {
      alt: {
        en: "Scamly app screen warning about a suspicious incoming call",
        bg: "Екран на Scamly с предупреждение за подозрително обаждане",
      },
    },
    caseStudy: true,
  },
  {
    slug: "supportai",
    name: { en: "SupportAI", bg: "SupportAI" },
    kind: { en: "Product demo", bg: "Демо продукт" },
    year: "2026",
    stack: ["[[STACK]]"],
    status: "live",
    summary: { en: "[[ONE-LINE DESCRIPTION]]", bg: "[[ЕДНО ИЗРЕЧЕНИЕ ОПИСАНИЕ]]" },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: { en: "[[WHAT YOU BUILT]]", bg: "[[КАКВО ИЗГРАДИ]]" },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]", code: "[[GITHUB]]" },
  },
  {
    slug: "ai-chatbot",
    name: { en: "AI Chatbot for businesses", bg: "AI чатбот за бизнеси" },
    kind: { en: "Product demo", bg: "Демо продукт" },
    year: "2026",
    stack: ["[[STACK]]"],
    status: "live",
    summary: { en: "[[ONE-LINE DESCRIPTION]]", bg: "[[ЕДНО ИЗРЕЧЕНИЕ ОПИСАНИЕ]]" },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: { en: "[[WHAT YOU BUILT]]", bg: "[[КАКВО ИЗГРАДИ]]" },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]", code: "[[GITHUB]]" },
  },
  {
    slug: "ai-data-analyst",
    name: { en: "AI Data Analyst", bg: "AI анализатор на данни" },
    kind: { en: "Product demo", bg: "Демо продукт" },
    year: "2026",
    stack: ["Python", "Pandas", "LLM API", "[[STACK]]"],
    status: "live",
    summary: {
      en: "Ask questions about a dataset in plain language and get answers, tables and charts back. Python and Pandas do the real work under the hood. [[DETAILS]]",
      bg: "Задаваш въпроси за набор от данни на обикновен език и получаваш отговори, таблици и графики. Реалната работа отдолу я вършат Python и Pandas. [[ДЕТАЙЛИ]]",
    },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: { en: "[[WHAT YOU BUILT]]", bg: "[[КАКВО ИЗГРАДИ]]" },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]", code: "[[GITHUB]]" },
  },
  {
    slug: "agility-os",
    name: { en: "AGility OS", bg: "AGility OS" },
    kind: { en: "Agency operating system", bg: "Операционна система на агенцията" },
    year: "2026",
    stack: ["[[STACK]]"],
    status: "internal",
    summary: {
      en: "The agency's internal operating system. One engagement record per client generates the proposal, the SOW and the project plan. Local-first, zero recurring cost, no vendor lock-in.",
      bg: "Вътрешната операционна система на агенцията. Един запис за всеки клиент генерира офертата, SOW и плана на проекта. Local-first, нулеви месечни разходи, без зависимост от доставчик.",
    },
    role: { en: "Founder · sole developer", bg: "Основател · единствен разработчик" },
    built: { en: "All of it, for daily use at AGility.", bg: "Всичко, за ежедневна работа в AGility." },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: {},
  },
  {
    slug: "iro-autonomous-robot",
    name: { en: "IRO Autonomous Robot", bg: "IRO автономен робот" },
    kind: { en: "IRO competition · Vienna", bg: "Състезание IRO · Виена" },
    year: "[[YEAR]]",
    stack: ["Electronics", "Camera", "Power systems", "[[STACK]]"],
    status: "competition",
    summary: {
      en: "A team of three building an autonomous car for the IRO competition in Vienna. Hardware, real constraints, real deadlines. Result: [[RESULT]].",
      bg: "Екип от трима, който изгражда автономна кола за състезанието IRO във Виена. Хардуер, реални ограничения, реални срокове. Резултат: [[RESULT]].",
    },
    role: { en: "Electronics, camera, battery & power", bg: "Електроника, камера, батерия и захранване" },
    built: {
      en: "The electrical side: wiring and electronics, the camera module, the battery and power distribution.",
      bg: "Електрическата част: окабеляване и електроника, камерата, батерията и разпределението на захранването.",
    },
    team: { en: "Team of 3", bg: "Екип от трима" },
    links: {},
  },
  {
    slug: "agility-promo-film",
    name: { en: "AGility Promo Film", bg: "Промо филм на AGility" },
    kind: { en: "30s vertical ad · coded motion", bg: "30 сек. вертикална реклама · motion в код" },
    year: "2026",
    stack: ["Motion graphics in code", "[[STACK]]"],
    status: "live",
    summary: {
      en: "A 30-second vertical ad built entirely as coded motion graphics. No stock footage, no AI video. Every frame is designed.",
      bg: "30-секундна вертикална реклама, изградена изцяло като motion графика в код. Без стокови кадри, без AI видео. Всеки кадър е проектиран.",
    },
    role: { en: "Design, motion, code", bg: "Дизайн, motion, код" },
    built: { en: "Everything, from storyboard to render.", bg: "Всичко, от сториборда до рендера." },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]" },
  },
  // [[MORE DEMOS — copy an entry above and fill the same fields]]
];

/**
 * Projects shown on the live site. A project whose summary is still only a placeholder
 * is hidden in production (rows, palette, sitemap, case pages) until you fill it in.
 */
export const visibleProjects = projects.filter((p) => SHOW_PLACEHOLDERS || filled(p.summary.en));

export const getProject = (slug: string) => visibleProjects.find((p) => p.slug === slug);
