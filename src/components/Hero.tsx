import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuGift } from "react-icons/lu";
import { ETIQUETA_ESTADO, MARCA, OFERTA, PRODUCTOS, type ProductoId } from "../config";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { HeroShowcase, DURACION_DEMO } from "./HeroShowcase";
import { LiveGrid } from "./LiveGrid";
import { BotonHayCancha } from "./hay-cancha/contexto";
import "./Hero.css";

const PALABRA: Record<ProductoId, string> = {
  cancha: "cancha",
  pelu: "peluquería",
  resto: "restaurante",
};

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
          <p className="eyebrow">
            <span className="hero__marca">
              <b>{MARCA.nombre}</b> <span aria-hidden="true">/</span>
            </span>
            {MARCA.bajada}
          </p>

          <h1 className="hero__title">
            <span className="hero__line">
              Tu{" "}
              <span className="hero__rotor" data-producto={actual.id}>
                <span key={actual.id} className="hero__word">
                  {PALABRA[actual.id]}
                </span>
              </span>
            </span>
            <span className="hero__line">atiende las 24 horas,</span>
            <span className="hero__line hero__line--suave">aunque vos no estés.</span>
          </h1>

          <p className="hero__lead">
            Página propia, reservas con seña por Mercado Pago y un asistente con IA que responde por vos. Sin
            planillas, sin idas y vueltas por WhatsApp y sin comprobantes truchos.
          </p>

          <div className="hero__ctas">
            <a className="btn btn--accent" href="#contacto">
              Pedí una demo <LuArrowRight aria-hidden="true" />
            </a>
            <BotonHayCancha className="btn btn--ghost" />
          </div>

          <p className="oferta">
            <span className="oferta__icono" aria-hidden="true">
              <LuGift size={16} />
            </span>
            <span>
              <b>{OFERTA.titulo}.</b> {OFERTA.detalle}
            </span>
          </p>

          <ul className="hero__estado" aria-label="Estado de cada producto">
            {PRODUCTOS.map((p) => (
              <li key={p.id} data-producto={p.id}>
                <span className="hero__dot" aria-hidden="true" />
                <strong>{p.nombre}</strong>
                <span className="mono">{ETIQUETA_ESTADO[p.estado]}</span>
              </li>
            ))}
          </ul>
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
