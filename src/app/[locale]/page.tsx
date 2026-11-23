import { Hero } from "@/components/hero/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { WorkLedger } from "@/components/sections/work-ledger";
import { WhatIDo } from "@/components/sections/what-i-do";
import { Studies } from "@/components/sections/studies";
import { Services } from "@/components/sections/services";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default async function Home() {
  return (
    <main id="main">
      <Hero />
      <WhatIDo />
      <ProofStrip />
      <WorkLedger />
      <Studies />
      <Services />
      <About />
      <Contact />
    </main>
  );
}
