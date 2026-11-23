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
    timeline: { en: "[[TIMELINE: e.g. 6 weeks, 2026]]", bg: "[[СРОК: напр. 6 седмици, 2026]]" },
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
        en: "Every channel is connected to one ingest layer and normalised into a single enquiry record, so the rest of the system never has to care where a message came from.",
        bg: "Всеки канал е свързан към един входен слой и се нормализира в един общ запис за запитване, така че останалата система не се интересува откъде е дошло съобщението.",
      },
      {
        en: "An LLM reads the raw text and extracts the fields that matter to a quote: product, dimensions, city and urgency, as validated structured output. Plain routing rules then send it to the right office, and the model drafts a first reply for a person to check and send.",
        bg: "LLM чете суровия текст и извлича полетата, които са важни за една оферта — продукт, размери, град и спешност — като валидиран структуриран резултат. После обикновени правила за насочване го пращат в правилния офис, а моделът подготвя първи отговор, който човек проверява и изпраща.",
      },
      {
        en: "Everything shows up live on one dashboard. It runs on a real Viber bot and a real Meta test page, not mock data.",
        bg: "Всичко се вижда на живо в едно табло. Работи с реален Viber бот и реална тестова Meta страница, а не с фалшиви данни.",
      },
    ],
    diagram: {
      caption: {
        en: "Five channels in, one record, one routed lead and a drafted reply out.",
        bg: "Пет канала навътре, един запис, едно насочено запитване и готов отговор навън.",
      },
      nodes: [
        n("form", "Web form", "Уеб форма", 70, 40, "input"),
        n("email", "Email", "Имейл", 70, 130, "input"),
        n("viber", "Viber bot", "Viber бот", 70, 220, "input"),
        n("fb", "Facebook", "Facebook", 70, 310, "input"),
        n("call", "Missed call", "Пропуснато обаждане", 70, 400, "input"),
        n("ingest", "Ingest + normalise", "Приемане + нормализиране", 330, 220, "core"),
        n("llm", "LLM extraction", "LLM извличане", 540, 220, "core"),
        n("route", "Routing rules", "Правила за насочване", 740, 130, "core"),
        n("draft", "Draft reply", "Чернова на отговор", 740, 310, "core"),
        n("offices", "Sofia · Varna · Burgas", "София · Варна · Бургас", 930, 130, "output"),
        n("dash", "Live dashboard", "Live табло", 930, 310, "output"),
      ],
      edges: [
        ["form", "ingest"],
        ["email", "ingest"],
        ["viber", "ingest"],
        ["fb", "ingest"],
        ["call", "ingest"],
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
        title: { en: "One record for every channel", bg: "Един запис за всеки канал" },
        body: {
          en: "Adapters turn each channel into the same shape. Some channel-specific detail is lost in the common view, so the raw payload stays attached for anyone who needs it.",
          bg: "Адаптерите превръщат всеки канал в една и съща форма. Част от детайлите на канала се губят в общия изглед, затова суровото съобщение остава прикачено за всеки, който има нужда от него.",
        },
      },
      {
        title: { en: "The model reads, the rules route", bg: "Моделът чете, правилата насочват" },
        body: {
          en: "The LLM handles messy human text. Which office gets the lead is decided by plain, auditable code. Rules need maintenance, but routing stays predictable and easy to explain to the client.",
          bg: "LLM-ът се справя с хаотичния човешки текст. Кой офис получава запитването се решава от обикновен, проверим код. Правилата изискват поддръжка, но насочването остава предвидимо и лесно за обяснение пред клиента.",
        },
      },
      {
        title: { en: "Draft, don’t send", bg: "Чернова, не изпращане" },
        body: {
          en: "The AI writes the first reply, and a person sends it. That's slower than auto-sending, but a wrong price never goes out under the company's name.",
          bg: "AI пише първия отговор, а човек го изпраща. По-бавно е от автоматичното изпращане, но грешна цена никога не излиза от името на фирмата.",
        },
      },
    ],
    result: [
      {
        en: "Status: client demo, built on live channels. [[STATUS]]",
        bg: "Статус: клиентско демо, изградено върху реални канали. [[STATUS]]",
      },
      {
        en: "[[METRIC: e.g. time to first reply, before → after]]",
        bg: "[[METRIC: напр. време до първи отговор, преди → след]]",
      },
    ],
    next: [
      {
        en: "Pilot it with real traffic at one office first, and measure time-to-first-reply and enquiry-to-quote rate against the old way.",
        bg: "Пилотно пускане с реален трафик първо в един офис и измерване на времето до първи отговор и дела запитвания, превърнати в оферти, спрямо стария начин.",
      },
      {
        en: "[[NEXT STEP]]",
        bg: "[[СЛЕДВАЩА СТЪПКА]]",
      },
    ],
  },

  scamly: {
    timeline: { en: "[[TIMELINE]] · competing December 2026", bg: "[[СРОК]] · състезание декември 2026" },
    problem: [
      {
        en: "Phone scams target older people because they work: a calm voice, an urgent story and a request for money or bank details. The people who could stop it, their families, usually find out afterwards.",
        bg: "Телефонните измами са насочени към възрастните хора, защото работят: спокоен глас, спешна история и искане на пари или банкови данни. Хората, които биха могли да ги спрат — семействата им — обикновено разбират след това.",
      },
    ],
    approach: [
      {
        en: "Scamly protects the person on the phone and brings their family into the loop. [[APPROACH: how Scamly detects or flags a suspicious call]]",
        bg: "Scamly пази човека на телефона и включва семейството му. [[ПОДХОД: как Scamly открива или маркира подозрително обаждане]]",
      },
      {
        en: "It's built as a distributed application for the National IT Tournament “John Atanasov”. [[ARCHITECTURE: services, devices, data flow]]",
        bg: "Изграден е като разпределено приложение за Националния ИТ турнир „Джон Атанасов“. [[АРХИТЕКТУРА: услуги, устройства, поток на данни]]",
      },
    ],
    diagram: {
      caption: {
        en: "Concept flow. Replace the placeholder node with how detection actually works.",
        bg: "Концептуален поток. Замени плейсхолдъра с това как реално работи откриването.",
      },
      nodes: [
        n("call", "Incoming call", "Входящо обаждане", 80, 220, "input"),
        n("app", "Scamly on the phone", "Scamly на телефона", 320, 220, "core"),
        n("check", "[[DETECTION]]", "[[ОТКРИВАНЕ]]", 560, 220, "core"),
        n("warn", "Warning on screen", "Предупреждение на екрана", 820, 120, "output"),
        n("family", "Family alert", "Сигнал към семейството", 820, 320, "output"),
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
        title: { en: "[[DECISION 1]]", bg: "[[РЕШЕНИЕ 1]]" },
        body: { en: "[[What you chose, what it cost, why it was worth it]]", bg: "[[Какво избра, на каква цена, защо си струваше]]" },
      },
      {
        title: { en: "[[DECISION 2]]", bg: "[[РЕШЕНИЕ 2]]" },
        body: { en: "[[…]]", bg: "[[…]]" },
      },
    ],
    result: [
      {
        en: "Competing in the Distributed Applications category, Sofia, December 2026. Result: [[RESULT]]",
        bg: "Участва в категория „Разпределени приложения“, София, декември 2026. Резултат: [[RESULT]]",
      },
    ],
    next: [{ en: "[[NEXT STEP]]", bg: "[[СЛЕДВАЩА СТЪПКА]]" }],
  },
};

export const getCaseStudy = (slug: string) => caseStudies[slug];
