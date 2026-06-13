import Contact from "@/components/Contact";
import Artifacts from "@/components/home/artifacts";
import Hero from "@/components/home/hero";
import Metrics from "@/components/home/metrics";
import Skills from "@/components/home/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <Skills />
      <Artifacts />
      <Metrics />
      <Contact />
    </>
  );
}
