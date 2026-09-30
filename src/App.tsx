import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Products } from "./components/Products";
import { HowItWorks } from "./components/HowItWorks";
import { AssistantDemo } from "./components/AssistantDemo";
import { Calculator } from "./components/Calculator";
import { WhyUs } from "./components/WhyUs";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { DemoHayCanchaProvider } from "./components/hay-cancha/contexto";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  useReveal();

  return (
    <DemoHayCanchaProvider>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Marquee />
        <Products />
        <HowItWorks />
        <AssistantDemo />
        <Calculator />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </DemoHayCanchaProvider>
  );
}
