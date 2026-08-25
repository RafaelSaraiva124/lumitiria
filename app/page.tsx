import Hero from "./components/Hero";
import AboutUs from "./components/aboutus";
import Projects from "./components/projetos/Projects";
import Cta from "./components/cta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <AboutUs />
      <Projects />
      <Cta />
    </main>
  );
}
