import type { L } from "./types";

/**
 * Long-form case studies for /work/[slug]. Keyed by project slug.
 *
 * Honesty: everything here is written from what you described in the brief.
 * Verify every sentence before launch, and keep [[PLACEHOLDERS]] until a fact is true.
 * The railings client stays anonymised: no brand name, logo or domain anywhere.
 */

export type DiagramNode = {
  id: string;
  label: L;
  x: number; // 0–1000
  y: number; // 0–440
  kind?: "input" | "core" | "output";
};

export type CaseStudy = {
  timeline: L;
  problem: L[];
  approach: L[];
  diagram: { nodes: DiagramNode[]; edges: [string, string][]; caption: L };
  decisions: { title: L; body: L }[];
  result: L[];
  next: L[];
};

const n = (id: string, en: string, bg: string, x: number, y: number, kind?: DiagramNode["kind"]): DiagramNode => ({
  id,
  label: { en, bg },
  x,
  y,
  kind,
});

export const caseStudies: Record<string, CaseStudy> = {
  "unified-enquiry-engine": {
    timeline: { en: "3 weeks · 2026", bg: "3 седмици · 2026" },
    problem: [
      {
        en: "A railings and balustrade manufacturer with three offices (Sofia, Varna and Burgas) gets enquiries from everywhere at once: the website form, email, Viber, Facebook and phone calls that nobody picks up.",
        bg: "Производител на парапети с три офиса (София, Варна и Бургас) получава запитвания отвсякъде едновременно: формата на сайта, имейл, Viber, Facebook и обаждания, на които никой не вдига.",
      },
      {
        en: "Each channel lives in a different app, owned by a different person. Enquiries arrive with half the details missing, land at the wrong office and wait. In this business the first company to reply with a sensible quote usually wins the job.",
        bg: "Всеки канал живее в различно приложение и е на различен човек. Запитванията идват с липсващи детайли, попадат в грешния офис и чакат. В този бизнес обикновено печели първата фирма, която отговори с разумна оферта.",
      },
    ],
    approach: [
      {
        en: "Four channels (the web form with photos, email, Viber and Facebook Messenger) feed one ingest layer, and every message becomes the same enquiry record. The rest of the system never has to care where a message came from.",
        bg: "Четири канала (уеб формата със снимки, имейл, Viber и Facebook Messenger) влизат в един входен слой и всяко съобщение става един и същ запис за запитване. Останалата система не се интересува откъде е дошло съобщението.",
      },
      {
        en: "An LLM reads the raw text and extracts who the customer is, what they want, sizes, city and urgency, as validated structured output. It also flags spam, job applications and large jobs. Plain rules then route the enquiry to the right office, with business hours.",
        bg: "LLM чете суровия текст и извлича кой е клиентът, какво иска, размери, град и спешност, като валидиран структуриран резултат. Отбелязва и спам, кандидатури за работа и големи поръчки. После обикновени правила насочват запитването към правилния офис, според работното време.",
      },
      {
        en: "The customer gets a reply within a minute, in Bulgarian or English, asking for at most three missing details. If nobody on the team responds, escalation emails go out at 5 and then 15 minutes. Staff see everything live on one dashboard in Bulgarian or English.",
        bg: "Клиентът получава отговор до минута, на български или английски, с най-много три въпроса за липсващите детайли. Ако никой от екипа не реагира, излизат имейли за ескалация на 5-ата и на 15-ата минута. Служителите виждат всичко на живо в едно табло на български или английски.",
      },
    ],
    diagram: {
      caption: {
        en: "Four channels in, one record, a reply within a minute, and the lead routed to the right office.",
        bg: "Четири канала навътре, един запис, отговор до минута и запитване, насочено към правилния офис.",
      },
      nodes: [
        n("form", "Web form", "Уеб форма", 70, 70, "input"),
        n("email", "Email", "Имейл", 70, 170, "input"),
        n("viber", "Viber", "Viber", 70, 270, "input"),
        n("fb", "Messenger", "Messenger", 70, 370, "input"),
        n("ingest", "Ingest + normalise", "Приемане + нормализиране", 330, 220, "core"),
        n("llm", "LLM extraction", "LLM извличане", 540, 220, "core"),
        n("route", "Routing rules", "Правила за насочване", 740, 130, "core"),
        n("draft", "Reply + validator", "Отговор + проверка", 740, 310, "core"),
        n("offices", "Sofia · Varna · Burgas", "София · Варна · Бургас", 930, 130, "output"),
        n("dash", "Live dashboard", "Live табло", 930, 310, "output"),
      ],
      edges: [
        ["form", "ingest"],
        ["email", "ingest"],
        ["viber", "ingest"],
        ["fb", "ingest"],
        ["ingest", "llm"],
        ["llm", "route"],
        ["llm", "draft"],
        ["route", "offices"],
        ["draft", "dash"],
        ["route", "dash"],
      ],
    },
    decisions: [
      {
        title: { en: "The model reads, the rules route", bg: "Моделът чете, правилата насочват" },
        body: {
          en: "The LLM handles messy human text. Which office gets the lead is decided by plain, auditable code. Rules need maintenance, but routing stays predictable and easy to explain to the client.",
          bg: "LLM-ът се справя с хаотичния човешки текст. Кой офис получава запитването се решава от обикновен, проверим код. Правилата изискват поддръжка, но насочването остава предвидимо и лесно за обяснение пред клиента.",
        },
      },
      {
        title: { en: "Templates first, then a check", bg: "Първо шаблон, после проверка" },
        body: {
          en: "Replies start from approved templates rather than free text, and a validator checks every reply before it goes out. Less creative, but a wrong price or a made-up promise never leaves under the company's name.",
          bg: "Отговорите тръгват от одобрени шаблони, а не от свободен текст, и валидатор проверява всеки отговор, преди да излезе. По-малко креативно, но грешна цена или измислено обещание никога не излизат от името на фирмата.",
        },
      },
      {
        title: { en: "The AI answers fast, then steps back", bg: "AI отговаря бързо, после се отдръпва" },
        body: {
          en: "The first reply and the follow-up questions go out automatically, because speed wins the job. The moment a person claims the enquiry or replies, the AI only drafts. Each channel can also be switched to draft-and-approve.",
          bg: "Първият отговор и уточняващите въпроси излизат автоматично, защото бързината печели поръчката. В момента, в който човек поеме запитването или отговори, AI само подготвя чернови. Всеки канал може да се превключи и на „чернова и одобрение“.",
        },
      },
    ],
    result: [
      {
        en: "A client demo, deployed and proven end to end on the web form. Under load, 20 enquiries sent half a second apart were all answered within 50 seconds, none twice.",
        bg: "Клиентско демо, пуснато и доказано от край до край с уеб формата. Под натоварване 20 запитвания, изпратени през половин секунда, получиха отговор до 50 секунди, без нито едно повторение.",
      },
      {
        en: "1,597 unit tests, plus integration and browser tests against the live database. Only test data goes through it until the launch list below is done.",
        bg: "1597 unit теста, плюс интеграционни и браузърни тестове срещу реалната база данни. Минават само тестови данни, докато не се изпълни списъкът за пускане по-долу.",
      },
    ],
    next: [
      {
        en: "A pilot at one office on real traffic. Before that: a paid AI provider that doesn't train on the data, a data-processing agreement with the client, their own Viber account and the Meta review for Messenger.",
        bg: "Пилот в един офис с реален трафик. Преди това: платен AI доставчик, който не се обучава върху данните, договор за обработка на данни с клиента, техен собствен Viber акаунт и одобрението от Meta за Messenger.",
      },
      {
        en: "Then measure it honestly: time to first reply and the share of enquiries that turn into quotes, against the old way. The dashboard already tracks first-reply time.",
        bg: "После честно измерване: времето до първи отговор и делът на запитванията, превърнати в оферти, спрямо стария начин. Таблото вече следи времето до първи отговор.",
      },
      {
        en: "After that, what the client needs most: missed calls turned into enquiries (once we know their phone system), and the AI reading photos and PDF drawings.",
        bg: "След това това, от което клиентът има най-голяма нужда: пропуснатите обаждания да стават запитвания (след като знаем каква телефонна система ползват) и AI да чете снимки и PDF чертежи.",
      },
    ],
  },

  scamly: {
    timeline: { en: "Nov–Dec 2026 · competing 4–6 December 2026", bg: "ноем.–дек. 2026 · състезание 4–6 декември 2026" },
    problem: [
      {
        en: "Phone scams target older people because they work: a calm voice, an urgent story and a request for money or bank details. The people who could stop it, their families, usually find out afterwards.",
        bg: "Телефонните измами са насочени към възрастните хора, защото работят: спокоен глас, спешна история и искане на пари или банкови данни. Хората, които биха могли да ги спрат — семействата им — обикновено разбират след това.",
      },
    ],
    approach: [
      {
        en: "During or right after a suspicious call, the person taps one big button and answers three or four yes/no questions: who the caller says they are, whether they want money or valuables, and whether they are rushing them or saying “don't tell anyone”. A red, yellow or green verdict comes back in plain Bulgarian, with a one-tap button to call a relative.",
        bg: "По време на подозрително обаждане или веднага след него човекът натиска един голям бутон и отговаря на три-четири въпроса с да/не: за кого се представя обаждащият се, иска ли пари или ценности и дали го притиска или казва „не казвайте на никого“. Връща се червена, жълта или зелена оценка на разбираем български, с бутон за обаждане на близък с едно докосване.",
      },
      {
        en: "The verdict comes from a rule-based detection engine written in plain TypeScript. It normalises and transliterates the text, fuzzy-matches known scam phrases, scores the signals and applies hard rules that force a red verdict, such as “police” plus a request for money. The family sees the result live, with web push and email as backup channels.",
        bg: "Оценката идва от енджин за разпознаване, базиран на правила и написан на чист TypeScript. Той нормализира и транслитерира текста, търси познати фрази от измами с fuzzy съвпадение, точкува сигналите и прилага твърди правила, които налагат червена оценка, например „полиция“ плюс искане на пари. Семейството вижда резултата на живо, а push известия и имейл служат като резервни канали.",
      },
      {
        en: "It's built as a distributed application for the National IT Tournament “John Atanasov”: a Next.js PWA on Vercel and Supabase Postgres with row-level security and Realtime. Guests can also read about current scam scripts, report a scam, and see a map of reports by district.",
        bg: "Изграден е като разпределено приложение за Националния ИТ турнир „Джон Атанасов“: Next.js PWA на Vercel и Supabase Postgres с row-level security и Realtime. Гостите могат също да четат за актуалните схеми, да подадат сигнал и да видят карта на сигналите по области.",
      },
    ],
    diagram: {
      caption: {
        en: "One call check, one verdict on the phone, and a live alert to the family.",
        bg: "Една проверка на обаждане, една оценка на телефона и сигнал на живо към семейството.",
      },
      nodes: [
        n("call", "Suspicious call", "Подозрително обаждане", 80, 220, "input"),
        n("app", "Big-button questions", "Въпроси с големи бутони", 300, 220, "core"),
        n("check", "Rule engine + hard rules", "Енджин с правила", 540, 220, "core"),
        n("warn", "Verdict on screen", "Оценка на екрана", 820, 120, "output"),
        n("family", "Live family alert", "Сигнал към семейството", 820, 320, "output"),
      ],
      edges: [
        ["call", "app"],
        ["app", "check"],
        ["check", "warn"],
        ["check", "family"],
      ],
    },
    decisions: [
      {
        title: { en: "Green never says “safe”", bg: "Зеленото никога не казва „безопасно“" },
        body: {
          en: "A green result says there are no typical signs of a scam, and suggests hanging up and calling the relative back on a number you know. A false “safe” is the worst bug this app could have, so the wording is part of the safety design.",
          bg: "Зеленият резултат казва, че няма типични признаци на измама, и съветва да затворите и да се обадите сами на близкия си на номера, който знаете. Фалшивото „безопасно“ е най-лошата грешка, която това приложение може да има, затова формулировката е част от защитата.",
        },
      },
      {
        title: { en: "Rules decide, AI can only add caution", bg: "Правилата решават, AI може само да добави предпазливост" },
        body: {
          en: "The verdict comes from tested rules, not a model, so it can be explained and it still works when an AI service is down. Any AI second opinion may raise the risk level but is never allowed to lower a red verdict.",
          bg: "Оценката идва от тествани правила, а не от модел, така че може да бъде обяснена и работи, дори когато AI услугата не отговаря. Второ мнение от AI може да повиши риска, но никога не може да свали червена оценка.",
        },
      },
      {
        title: { en: "No password for the older person", bg: "Без парола за възрастния човек" },
        body: {
          en: "The family creates the profile and pairs the phone once with a 6-digit code or a QR code. After that it stays signed in, because a login screen is exactly where an older user gives up.",
          bg: "Семейството създава профила и сдвоява телефона веднъж с 6-цифрен код или QR код. След това той остава вписан, защото екранът за вход е точно мястото, където възрастният потребител се отказва.",
        },
      },
    ],
    result: [
      {
        en: "Competing in the Distributed Applications category, Sofia, 4–6 December 2026. Result: [[RESULT]]",
        bg: "Участва в категория „Разпределени приложения“, София, 4–6 декември 2026. Резултат: [[RESULT]]",
      },
      {
        en: "Tested before it reaches the jury: 661 unit tests, 111 end-to-end tests on desktop and phone, and 180 database security checks.",
        bg: "Тестван, преди да стигне до журито: 661 unit теста, 111 end-to-end теста на компютър и телефон и 180 проверки на сигурността на базата данни.",
      },
    ],
    next: [
      {
        en: "Test it with real families, then work with the police or a municipality to reach the people who need it most.",
        bg: "Тестове с реални семейства, а след това партньорство с полицията или община, за да стигне до хората, които най-много имат нужда от него.",
      },
    ],
  },
};

export const getCaseStudy = (slug: string) => caseStudies[slug];
