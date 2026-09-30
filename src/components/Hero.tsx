import { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { OFERTA, PRODUCTOS } from "../config";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { HeroShowcase, DURACION_DEMO } from "./HeroShowcase";
import { LiveGrid } from "./LiveGrid";
import { Cuaderno } from "./Cuaderno";
import { BotonHayCancha } from "./hay-cancha/contexto";
import "./Hero.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const enVista = useInView(ref);
  const reduce = useReducedMotion();
  const corriendo = enVista && !reduce;

  const [indice, setIndice] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const actual = PRODUCTOS[indice];

  // Cada vez que vuelve a correr (entra en pantalla), la demo arranca de nuevo.
  useEffect(() => {
    if (corriendo) setCiclo((c) => c + 1);
  }, [corriendo]);

  // Pasa sola a la demo siguiente.
  useEffect(() => {
    if (!corriendo) return;
    const id = window.setTimeout(() => {
      setIndice((i) => (i + 1) % PRODUCTOS.length);
      setCiclo((c) => c + 1);
    }, DURACION_DEMO[actual.id]);
    return () => window.clearTimeout(id);
  }, [corriendo, ciclo, actual.id]);

  const elegir = (i: number) => {
    setIndice(i);
    setCiclo((c) => c + 1);
  };

  return (
    <section id="top" className="hero" ref={ref}>
      <LiveGrid activo={corriendo} />
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">Tirá el cuaderno.</h1>

          {/* Cambia de rubro junto con el celular de la derecha */}
          <Cuaderno id={actual.id} reduce={reduce} />

          <p className="hero__lead">
            Las reservas, las señas y quién pagó, en un solo lugar que se actualiza solo. Tus clientes reservan desde
            tu página y el turno se confirma cuando Mercado Pago aprueba el pago.
          </p>

          <div className="hero__ctas">
            <a className="btn btn--accent" href="#contacto">
              Pedí una demo <LuArrowRight aria-hidden="true" />
            </a>
            <BotonHayCancha className="hero__link" conIcono={false} />
          </div>

          <p className="hero__oferta">
            <b>{OFERTA.titulo}.</b> {OFERTA.detalle}
          </p>
        </div>

        <HeroShowcase
          indice={indice}
          ciclo={ciclo}
          corriendo={corriendo}
          reduce={reduce}
          onElegir={elegir}
        />
      </div>
    </section>
  );
}
