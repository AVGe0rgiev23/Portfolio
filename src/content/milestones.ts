import type { L } from "./types";

export type Milestone = {
  date: string; // mono, e.g. "2024" or "DEC 2026"
  title: L;
  line: L;
  next?: boolean;
};

export const milestones: Milestone[] = [
  {
    date: "2023",
    title: { en: "VSCPI Burgas", bg: "ПГКПИ Бургас" },
    line: {
      en: "Started AI programming: Python, machine learning, NumPy, Pandas and data modelling.",
      bg: "Започнах AI програмиране: Python, машинно обучение, NumPy, Pandas и моделиране на данни.",
    },
  },
  {
    date: "JUN 2026",
    title: { en: "Founded AGility", bg: "Основах AGility" },
    line: {
      en: "An AI automation agency for businesses: chatbots, enquiry automation, internal tools.",
      bg: "Агенция за AI автоматизация за бизнеси: чатботове, автоматизация на запитвания, вътрешни инструменти.",
    },
  },
  {
    date: "NOV 2026",
    title: { en: "Robo League, Varna", bg: "Robo League, Варна" },
    line: {
      en: "First robotics competition. Line-following robot, clean run in 36.6 s.",
      bg: "Първо състезание по роботика. Робот, който следва линия, чисто бягане за 36,6 с.",
    },
  },
  {
    date: "DEC 2026",
    title: { en: "John Atanasov National IT Tournament", bg: "Национален ИТ турнир „Джон Атанасов“" },
    line: {
      en: "Competing with Scamly in Distributed Applications, Sofia.",
      bg: "Участие със Scamly в категория „Разпределени приложения“, София.",
    },
  },
  {
    date: "JAN 2027",
    title: { en: "IRO, Vienna", bg: "IRO, Виена" },
    line: {
      en: "Team of three, autonomous car. I own electronics, camera and power.",
      bg: "Екип от трима, автономна кола. Отговарям за електрониката, камерата и захранването.",
    },
  },
  {
    date: "NEXT",
    title: { en: "University abroad", bg: "Университет в чужбина" },
    line: {
      en: "The next step. AGility keeps running.",
      bg: "Следващата стъпка. AGility продължава да работи.",
    },
    next: true,
  },
];
