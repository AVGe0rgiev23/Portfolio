import { Hero } from "@/components/hero/hero";
import { WorkLedger } from "@/components/sections/work-ledger";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

export default async function Home() {
  return (
    <main id="main">
      <Hero />
      <WorkLedger />
      <About />
      <Services />
      <Contact />
    </main>
  );
}
