import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  LuBellRing,
  LuCalendarCheck,
  LuCreditCard,
  LuMousePointerClick,
  LuQrCode,
  LuStore,
  LuTimer,
  LuWallet,
} from "react-icons/lu";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { retraso } from "../hooks/useReveal";
import { useScrollProgress } from "../hooks/useScrollProgress";
import "./HowItWorks.css";

const PASOS = [
  {
    Icono: LuStore,
    titulo: "Te damos de alta",
    texto:
      "Cargamos tus canchas o servicios, horarios, precios, logo y colores. Si mañana cambia algo, lo cambiás vos desde el panel.",
  },
  {
    Icono: LuWallet,
    titulo: "Vinculás tu Mercado Pago",
    texto: "Con un botón. Las señas entran directo a tu cuenta: nosotros nunca tocamos tu plata.",
  },
  {
    Icono: LuQrCode,
    titulo: "Compartís tu link",
    texto:
      "En la bio de Instagram, en un QR en el mostrador y en la respuesta automática de WhatsApp. Desde ahí, tus clientes reservan solos.",
  },
];

const FLUJO = [
  { Icono: LuMousePointerClick, titulo: "Elige horario", texto: "Ve qué queda libre y elige." },
  { Icono: LuCreditCard, titulo: "Paga la seña", texto: "Con Mercado Pago, sin salir del celular." },
  { Icono: LuBellRing, titulo: "Mercado Pago avisa", texto: "Nos llega el pago aprobado y lo verificamos." },
  { Icono: LuCalendarCheck, titulo: "Turno confirmado", texto: "Le llega el email y aparece en tu agenda." },
];

export function HowItWorks() {
  const pasosRef = useRef<HTMLOListElement>(null);
  const progreso = useScrollProgress(pasosRef);

  const flujoRef = useRef<HTMLDivElement>(null);
  const enVista = useInView(flujoRef);
  const reduce = useReducedMotion();
  const [nodo, setNodo] = useState(0);

  useEffect(() => {
    if (!enVista || reduce) return;
    const id = window.setInterval(() => setNodo((n) => (n + 1) % FLUJO.length), 1500);
    return () => window.clearInterval(id);
  }, [enVista, reduce]);

  return (
    <section id="como-funciona" className="section como">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="left">
            <b>02</b> Cómo funciona
          </p>
          <h2 data-reveal="up" style={retraso(80)}>
            De cero a recibir reservas, sin configurar nada
          </h2>
          <p data-reveal="up" style={retraso(160)}>Nosotros hacemos el alta y la carga de datos. Vos vinculás tu cuenta y compartís el link.</p>
        </div>

        <ol className="como__pasos" ref={pasosRef}>
          {PASOS.map((p, i) => {
            const umbral = (i + 0.35) / PASOS.length;
            const siguiente = (i + 1.35) / PASOS.length;
            const alcanzado = progreso >= umbral || progreso >= 0.98;
            const relleno = Math.min(1, Math.max(0, (progreso - umbral) / (siguiente - umbral)));
            return (
              <li
                key={p.titulo}
                className={`como__paso ${alcanzado ? "is-alcanzado" : ""}`}
                data-reveal="up"
                style={{ "--relleno": relleno, "--reveal-delay": `${i * 140}ms` } as CSSProperties}
              >
                <span className="como__numero mono" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="como__tarjeta">
                  <span className="como__icono" aria-hidden="true">
                    <p.Icono size={22} />
                  </span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flujo" ref={flujoRef} data-reveal="zoom">
          <div className="flujo__cabecera">
            <h3>Y cuando alguien reserva…</h3>
            <p className="flujo__nota">
              <LuTimer size={18} aria-hidden="true" />
              <span>
                <b>¿Y si no paga?</b> El horario queda apartado 10 minutos. Si no paga, se libera solo para otro.
              </span>
            </p>
          </div>
          <ol className="flujo__nodos" style={{ "--nodo": nodo } as CSSProperties}>
            {FLUJO.map((f, i) => (
              <li
                key={f.titulo}
                className={`flujo__nodo ${i === nodo && !reduce ? "is-activo" : ""} ${i < nodo ? "is-hecho" : ""}`}
                data-reveal="left"
                style={retraso(250 + i * 120)}
              >
                <span className="flujo__icono" aria-hidden="true">
                  <f.Icono size={20} />
                </span>
                <strong>{f.titulo}</strong>
                <span>{f.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
