import { Hero } from "@/components/hero/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { TwoLedgers } from "@/components/sections/two-ledgers";
import { WorkLedger } from "@/components/sections/work-ledger";
import { WhatIDo } from "@/components/sections/what-i-do";
import { Studies } from "@/components/sections/studies";
import { Services } from "@/components/sections/services";
import { Capabilities } from "@/components/sections/capabilities-section";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default async function Home() {
  return (
    <main id="main">
      <Hero />
      <WhatIDo />
      <ProofStrip />
      <TwoLedgers />
      <WorkLedger />
      <Studies />
      <Services />
      <Capabilities />
      <About />
      <Contact />
    </main>
  );
}
