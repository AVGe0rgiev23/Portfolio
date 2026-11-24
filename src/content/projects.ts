import { SHOW_PLACEHOLDERS, filled, type L } from "./types";

/**
 * Selected work. Order here = order on the site. Featured projects first.
 *
 * Honesty rules:
 * - Never invent metrics, clients or results. Use [[METRIC: …]] / [[RESULT]] until a number is true.
 * - The railings client is anonymised. No brand name, logo or domain — anywhere, including alt text.
 */

export type ProjectStatus = "live" | "production" | "competition" | "internal" | "demo" | "prototype";

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
  /** Big row with links on the homepage. The rest go in the compact "More" list. */
  featured?: boolean;
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
    stack: ["Next.js", "TypeScript", "Supabase", "Trigger.dev", "Groq LLM", "Viber & Meta APIs", "Resend"],
    status: "demo",
    summary: {
      en: "One real-time inbox for the web form, email, Viber and Facebook Messenger. AI reads each enquiry, pulls out product, sizes, city and urgency, replies within a minute and routes the lead to the right office: Sofia, Varna or Burgas.",
      bg: "Една входяща кутия в реално време за уеб формата, имейл, Viber и Facebook Messenger. AI чете всяко запитване, извлича продукт, размери, град и спешност, отговаря до минута и насочва запитването към правилния офис: София, Варна или Бургас.",
    },
    role: { en: "Solo: scoping, architecture, build", bg: "Сам: обхват, архитектура, разработка" },
    built: {
      en: "Everything: the four channel integrations, the AI pipeline (extraction, template-first replies and a validator), routing and escalation rules, and the live dashboard in Bulgarian and English.",
      bg: "Всичко: интеграциите с четирите канала, AI pipeline-а (извличане, отговори по шаблон и проверка преди изпращане), правилата за насочване и ескалация и live таблото на български и английски.",
    },
    team: { en: "Solo", bg: "Самостоятелно" },
    // Private client repo. Keep it private: the client stays anonymous everywhere.
    links: {},
    featured: true,
    media: {
      alt: {
        en: "Dashboard showing enquiries from four channels merged into one inbox, each tagged with product, city and urgency",
        bg: "Табло със запитвания от четири канала, обединени в една кутия, всяко с продукт, град и спешност",
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
    stack: ["Next.js", "TypeScript", "Supabase", "Realtime", "Web Push", "Playwright"],
    status: "competition",
    summary: {
      en: "A web app that helps older people in Bulgaria recognise a phone scam in about 30 seconds and alerts their family at once. Competing at the National IT Tournament “John Atanasov”, Sofia, 4–6 December 2026. Result: [[RESULT]].",
      bg: "Уеб приложение, което помага на възрастните хора в България да разпознаят телефонна измама за около 30 секунди и веднага предупреждава близките им. Участва в Националния ИТ турнир „Джон Атанасов“, София, 4–6 декември 2026. Резултат: [[RESULT]].",
    },
    role: { en: "Backend lead · team of 2", bg: "Отговарям за бекенда · екип от двама" },
    built: {
      en: "The scam-detection engine (normalising, transliteration, fuzzy matching, scoring and hard rules), device pairing, real-time family alerts and web push, the public report form and the admin area.",
      bg: "Енджина за разпознаване на измами (нормализиране, транслитерация, fuzzy търсене, точкуване и твърди правила), сдвояването на устройства, сигналите към семейството в реално време и push известията, формата за сигнали и админ панела.",
    },
    team: { en: "Alex Georgiev + Roberta Hristova", bg: "Алекс Георгиев + Роберта Христова" },
    links: { live: "https://scamly-ochre.vercel.app", code: "https://github.com/AVGe0rgiev23/Scamly" },
    featured: true,
    media: {
      poster: "/work/scamly.jpg",
      alt: {
        en: "Scamly home page: a sample call checked on a phone, with a risk gauge and the reason for the verdict",
        bg: "Началната страница на Scamly: примерно обаждане, проверено на телефон, с уред за риска и причината за оценката",
      },
    },
    caseStudy: true,
  },
  {
    slug: "supportai",
    name: { en: "SupportAI", bg: "SupportAI" },
    kind: { en: "Product · AI customer support", bg: "Продукт · AI поддръжка на клиенти" },
    year: "2026",
    stack: ["Next.js", "TypeScript", "MongoDB Vector Search", "Trigger.dev", "Gemini + Groq"],
    status: "live",
    summary: {
      en: "Paste one snippet on a website and get a support agent that has read the company's docs, answers customers in seconds and hands over to a person when it isn't sure.",
      bg: "Поставяте един код на сайта си и получавате агент за поддръжка, който е прочел документите на фирмата, отговаря на клиентите за секунди и предава на човек, когато не е сигурен.",
    },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: {
      en: "All of it: website crawling and document ingestion (PDF, Word, CSV, old tickets), vector search, the chat widget with hand-off to a person, and the dashboard. Runs on free tiers, with Groq as a fallback when Gemini is down.",
      bg: "Всичко: обхождане на сайта и зареждане на документи (PDF, Word, CSV, стари тикети), векторно търсене, чат уиджета с предаване към човек и таблото. Работи на безплатни планове, с Groq като резерва, когато Gemini не отговаря.",
    },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "https://supportai-beta.vercel.app", code: "https://github.com/AVGe0rgiev23/AIsupport" },
    featured: true,
    media: {
      poster: "/work/supportai.jpg",
      alt: {
        en: "SupportAI home page with a chat widget answering a returns question from the shop's own policy",
        bg: "Началната страница на SupportAI с чат уиджет, който отговаря на въпрос за връщане по правилата на магазина",
      },
    },
  },
  {
    slug: "ai-data-analyst",
    name: { en: "AI Data Analyst", bg: "AI анализатор на данни" },
    kind: { en: "Product demo", bg: "Демо продукт" },
    year: "2026",
    stack: ["Next.js", "TypeScript", "DuckDB", "AI SDK", "Recharts"],
    // "prototype" until there is a public URL; switch to "live" when links.live is real.
    status: "prototype",
    summary: {
      en: "Drop in a CSV and ask questions in plain English. An agent writes the SQL, runs it and charts the result, then a validator checks every number in the answer against the rows the queries actually returned.",
      bg: "Качвате CSV и задавате въпроси на обикновен език. Агент пише SQL заявките, изпълнява ги и чертае графика, а после валидатор проверява всяко число в отговора спрямо редовете, които заявките реално са върнали.",
    },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: {
      en: "All of it: the agent loop, a read-only SQL guard built on DuckDB's own parser, charts drawn only from stored results, the answer validator and an evaluation set (26 of 26 passing).",
      bg: "Всичко: агента, защитата, която допуска само четене (чрез парсера на DuckDB), графиките, които се чертаят само от запазени резултати, валидатора на отговорите и набор от тестови въпроси (26 от 26 минават).",
    },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]", code: "https://github.com/AVGe0rgiev23/ai-data-analyst" },
    featured: true,
    media: {
      poster: "/work/ai-data-analyst.jpg",
      alt: {
        en: "AI Data Analyst answering a revenue question: the agent's SQL steps, a corrected query, a results table and a line chart by region",
        bg: "AI анализатор на данни отговаря на въпрос за приходите: стъпките със SQL, поправена заявка, таблица с резултати и графика по региони",
      },
    },
  },
  {
    slug: "ai-chatbot",
    name: { en: "AI Chatbot for businesses", bg: "AI чатбот за бизнеси" },
    kind: { en: "Product demo", bg: "Демо продукт" },
    year: "2026",
    stack: ["Next.js", "TypeScript", "Claude API", "Upstash Redis"],
    // "prototype" until there is a public URL; switch to "live" when links.live is real.
    status: "prototype",
    summary: {
      en: "A support assistant for a rental shop that shows how confident it is, hands over to a person instead of guessing, and books real appointments.",
      bg: "Асистент за поддръжка на магазин за наем на екипировка, който показва колко е сигурен, предава на човек вместо да гадае и записва реални часове.",
    },
    role: { en: "Solo", bg: "Самостоятелно" },
    built: {
      en: "All of it: retrieval over the shop's knowledge base, Claude with structured output, the confidence checks and the booking flow, where the model never writes a date or time itself.",
      bg: "Всичко: търсенето в базата знания на магазина, Claude със структуриран отговор, проверките на увереността и записването на час, при което моделът никога не пише дата или час сам.",
    },
    team: { en: "Solo", bg: "Самостоятелно" },
    links: { live: "[[URL]]", code: "https://github.com/AVGe0rgiev23/AI-Chat-Bot---Demo-version-" },
  },
  {
    slug: "agility-os",
    name: { en: "AGility OS", bg: "AGility OS" },
    kind: { en: "My agency dashboard", bg: "Таблото на агенцията ми" },
    year: "2026",
    stack: ["React", "TypeScript", "Vite", "IndexedDB"],
    status: "internal",
    summary: {
      en: "The dashboard I built to make running AGility easier. Each client lives in one record, from discovery notes to processes and scored opportunities, so nothing gets typed twice. Local-first, with zero monthly cost.",
      bg: "Таблото, което направих, за да ми е по-лесно да управлявам AGility. Всеки клиент е в един запис, от бележките от първата среща до процесите и оценените възможности, така че нищо не се въвежда два пъти. Local-first, без месечни разходи.",
    },
    role: { en: "Founder · sole developer", bg: "Основател · единствен разработчик" },
    built: { en: "All of it, for my own daily use at AGility.", bg: "Всичко, за ежедневната ми работа в AGility." },
    team: { en: "Solo", bg: "Самостоятелно" },
    // Internal tool: shown as a dashboard only, no code link.
    links: {},
  },
  {
    slug: "iro-autonomous-robot",
    name: { en: "IRO Autonomous Robot", bg: "IRO автономен робот" },
    kind: { en: "IRO competition · Vienna · January 2027", bg: "Състезание IRO · Виена · януари 2027" },
    year: "2027",
    stack: ["Electronics", "Camera", "Power systems", "[[STACK]]"],
    status: "competition",
    summary: {
      en: "A team of three building an autonomous car for the IRO competition in Vienna, in January 2027. Hardware, real constraints, real deadlines. [[DETAILS]]",
      bg: "Екип от трима, който изгражда автономна кола за състезанието IRO във Виена през януари 2027. Хардуер, реални ограничения, реални срокове. [[ДЕТАЙЛИ]]",
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
    slug: "robotline",
    name: { en: "RobotLine", bg: "RobotLine" },
    kind: { en: "Robo League · Varna · line following", bg: "Robo League · Варна · следване на линия" },
    year: "2026",
    stack: ["Arduino", "C++", "Pololu Zumo", "PD control"],
    status: "competition",
    summary: {
      en: "Our first robotics competition: a line-following robot for Robo League 2026–2027 in Varna. We started knowing nothing about robotics. In round 1 it made a clean run in 36.6 s; round 2 is in April 2027.",
      bg: "Първото ни състезание по роботика: робот, който следва линия, за Robo League 2026–2027 във Варна. Започнахме, без да знаем нищо за роботиката. В първия кръг направи чисто бягане за 36,6 с; вторият кръг е през април 2027.",
    },
    role: { en: "Team member · first robotics project", bg: "Член на отбора · първи проект по роботика" },
    built: {
      en: "[[WHAT YOU BUILT: e.g. the race firmware, speed modes and the tuning tool]]",
      bg: "[[КАКВО ИЗГРАДИ: напр. състезателния фърмуер, режимите на скорост и инструмента за настройка]]",
    },
    team: { en: "[[TEAM]]", bg: "[[ЕКИП]]" },
    links: { code: "https://github.com/AVGe0rgiev23/RobotLine" },
  },
  {
    slug: "agility-promo-film",
    name: { en: "AGility Promo Film", bg: "Промо филм на AGility" },
    kind: { en: "30s vertical ad · coded motion", bg: "30 сек. вертикална реклама · motion в код" },
    year: "2026",
    stack: ["Motion graphics in code", "[[STACK]]"],
    // "prototype" until the film has a public URL (or a video file in /public/work).
    status: "prototype",
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
