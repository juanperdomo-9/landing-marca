import type { ComponentType } from "react";
import { LuBadgeCheck, LuBot, LuCalendarCheck, LuClock, LuUsers } from "react-icons/lu";
import { PRODUCTOS, type ProductoId } from "../config";
import { useTimeline } from "../hooks/useTimeline";
import { Phone } from "./Phone";
import { IconoProducto } from "./icons";
import { DemoCancha } from "./demos/DemoCancha";
import { DemoPeluqueria } from "./demos/DemoPeluqueria";
import { DemoRestaurante } from "./demos/DemoRestaurante";
import "./HeroShowcase.css";

export const DURACION_DEMO: Record<ProductoId, number> = {
  cancha: 9000,
  pelu: 10000,
  resto: 9000,
};

const TIEMPOS: Record<ProductoId, readonly number[]> = {
  cancha: [1400, 2600, 4300, 5800],
  pelu: [800, 1500, 2800, 4300, 5000, 6200, 7600],
  resto: [1100, 2000, 2900, 4300, 5900],
};

const DEMOS: Record<ProductoId, ComponentType<{ paso: number }>> = {
  cancha: DemoCancha,
  pelu: DemoPeluqueria,
  resto: DemoRestaurante,
};

const ETIQUETA_TAB: Record<ProductoId, string> = {
  cancha: "Cancha",
  pelu: "Peluquería",
  resto: "Restaurante",
};

interface Aviso {
  desde: number;
  hasta?: number;
  Icono: ComponentType<{ size?: number }>;
  titulo: string;
  detalle: string;
}

const AVISOS: Record<ProductoId, Aviso[]> = {
  cancha: [
    { desde: 0, hasta: 2, Icono: LuUsers, titulo: "Quedan 3 canchas", detalle: "Fútbol 7 · hoy 21:00" },
    { desde: 4, Icono: LuBadgeCheck, titulo: "Seña aprobada", detalle: "$15.000 · Mercado Pago" },
  ],
  pelu: [
    { desde: 3, Icono: LuBot, titulo: "Respondió el asistente", detalle: "Precio y horarios de Lucas" },
    { desde: 7, Icono: LuCalendarCheck, titulo: "Turno confirmado", detalle: "Jue 18:00 · Corte y barba" },
  ],
  resto: [
    { desde: 4, Icono: LuClock, titulo: "Retira a las 21:15", detalle: "3 productos · $34.500" },
    { desde: 5, Icono: LuBadgeCheck, titulo: "Pago aprobado", detalle: "Pedido #127 · Mercado Pago" },
  ],
};

interface Props {
  indice: number;
  ciclo: number;
  corriendo: boolean;
  reduce: boolean;
  onElegir: (i: number) => void;
}

export function HeroShowcase({ indice, ciclo, corriendo, reduce, onElegir }: Props) {
  const id = PRODUCTOS[indice].id;
  const pasoTimeline = useTimeline(TIEMPOS[id], corriendo, ciclo);
  const paso = reduce ? TIEMPOS[id].length : pasoTimeline;
  const Demo = DEMOS[id];
  const ultimoAviso = AVISOS[id].reduce(
    (ultimo, a, i) => (paso >= a.desde && (a.hasta === undefined || paso <= a.hasta) ? i : ultimo),
    -1,
  );

  return (
    <div className="showcase" data-producto={id}>
      <div className="showcase__stage">
        <div className="showcase__halo" aria-hidden="true" />
        <Phone>
          <div key={id} className="showcase__screen">
            <Demo paso={paso} />
          </div>

          {/* Notificaciones dentro de la pantalla: se ve solo la última que llegó */}
          <div key={`avisos-${id}`} className="showcase__avisos" aria-hidden="true">
            {AVISOS[id].map((a, i) => (
              <div key={a.titulo} className={`aviso ${i === ultimoAviso ? "is-visible" : ""}`}>
                <span className="aviso__icono">
                  <a.Icono size={16} />
                </span>
                <span className="aviso__texto">
                  <strong>{a.titulo}</strong>
                  <span>{a.detalle}</span>
                </span>
                <span className="aviso__hora">ahora</span>
              </div>
            ))}
          </div>
        </Phone>
      </div>

      <div className="showcase__tabs" role="group" aria-label="Elegí qué demo ver">
        {PRODUCTOS.map((p, i) => {
          const activo = i === indice;
          return (
            <button
              key={p.id}
              type="button"
              data-producto={p.id}
              className={`showcase__tab ${activo ? "is-activo" : ""}`}
              aria-pressed={activo}
              onClick={() => onElegir(i)}
            >
              <IconoProducto id={p.id} size={18} />
              <span>{ETIQUETA_TAB[p.id]}</span>
              <span className="showcase__barra" aria-hidden="true">
                {activo && (
                  <i
                    key={ciclo}
                    className={corriendo ? "is-corriendo" : "is-llena"}
                    style={{ animationDuration: `${DURACION_DEMO[p.id]}ms` }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Demo de {ETIQUETA_TAB[id].toLowerCase()}: así se ve la página que usan tus clientes.
      </p>
    </div>
  );
}
