/** Single source of truth for identity, links and contact. Edit here, not in components. */
export const site = {
  name: "Alex Georgiev",
  shortName: "AG",
  agency: "AGility",
  agencyUrl: "https://agility-scaffold-tmp.vercel.app/",
  city: "Burgas",
  country: "BG",
  timeZone: "Europe/Sofia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "[[EMAIL]]",
  calLink: "[[CAL_LINK]]",
  cv: "/cv.pdf",
  portrait: "/alex.jpg", // [[/public/alex.jpg]] — add a real portrait
  socials: {
    github: "https://github.com/AVGe0rgiev23",
    linkedin: "https://www.linkedin.com/in/alex-georgiev-028741417",
  },
} as const;

export const isSet = (value: string) => !/^\[\[.*\]\]$/.test(value);
