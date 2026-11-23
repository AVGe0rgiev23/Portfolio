import type { L } from "./types";

export type Service = {
  id: string;
  title: L;
  problem: L;
  build: L;
  result: L; // keep [[METRIC]] until you have a true number
  tech: string;
};

export const services: Service[] = [
  {
    id: "enquiry",
    title: { en: "Enquiry & lead automation", bg: "Автоматизация на запитвания" },
    problem: {
      en: "You lose leads because nobody replies in time.",
      bg: "Губите клиенти, защото никой не отговаря навреме.",
    },
    build: {
      en: "Every channel lands in one inbox. AI reads each enquiry, pulls out what matters and drafts the first reply.",
      bg: "Всеки канал влиза в една кутия. AI чете всяко запитване, извлича важното и подготвя първия отговор.",
    },
    result: { en: "[[METRIC: e.g. reply time from 4h to 2 min]]", bg: "[[METRIC: напр. време за отговор от 4 ч до 2 мин]]" },
    tech: "LLM · Viber · Meta · Email",
  },
  {
    id: "assistants",
    title: { en: "AI chatbots & assistants", bg: "AI чатботове и асистенти" },
    problem: {
      en: "Your team answers the same twenty questions every day.",
      bg: "Екипът ви отговаря на едни и същи двайсет въпроса всеки ден.",
    },
    build: {
      en: "An assistant trained on your own documents that answers customers and hands off to a person when it should.",
      bg: "Асистент, обучен на вашите документи, който отговаря на клиентите и предава на човек, когато трябва.",
    },
    result: { en: "[[METRIC]]", bg: "[[METRIC]]" },
    tech: "RAG · LLM APIs · Next.js",
  },
  {
    id: "internal",
    title: { en: "Internal tools & dashboards", bg: "Вътрешни инструменти и табла" },
    problem: {
      en: "Your business runs on spreadsheets nobody trusts.",
      bg: "Бизнесът ви върви на таблици, на които никой не вярва.",
    },
    build: {
      en: "A small, fast tool built around how your team actually works, with one source of truth.",
      bg: "Малък, бърз инструмент, изграден около начина, по който екипът ви реално работи, с един източник на истина.",
    },
    result: { en: "[[METRIC]]", bg: "[[METRIC]]" },
    tech: "Next.js · TypeScript · Postgres",
  },
  {
    id: "analysis",
    title: { en: "AI data analysis", bg: "AI анализ на данни" },
    problem: {
      en: "You have the data, but no time to ask it anything.",
      bg: "Имате данните, но нямате време да ги питате нищо.",
    },
    build: {
      en: "Ask your sales or operations data questions in plain language. Get answers, tables and charts.",
      bg: "Питате данните си за продажби или операции на обикновен език. Получавате отговори, таблици и графики.",
    },
    result: { en: "[[METRIC]]", bg: "[[METRIC]]" },
    tech: "Python · Pandas · LLM",
  },
];
