import { PRODUCTOS, type ProductoId } from "../config";
import { useTimeline } from "../hooks/useTimeline";
import { pesos } from "../lib/formato";
import { IconoProducto } from "./icons";
import "./HeroShowcase.css";

export const DURACION_DEMO: Record<ProductoId, number> = {
  cancha: 8000,
  pelu: 8000,
  resto: 8000,
};

/** Pasos: 1 el cliente elige · 2 aprieta pagar · 3 reservado y la reserva viaja · 4 se pinta en el panel del dueño */
const TIEMPOS = [1200, 2500, 3200, 4000] as const;

interface Escena {
  negocio: string;
  opciones: { texto: string; precio?: number }[];
  elegida: number;
  sena: number;
  listo: string;
  detalle: string;
  panel: string;
  columnas: number;
  /** Panel del dueño, celda por celda: X ocupada, . libre, ? la que entra ahora */
  grilla: string;
}

const ESCENAS: Record<ProductoId, Escena> = {
  cancha: {
    negocio: "Complejo El Potrero",
    opciones: [
      { texto: "19:00 · Fútbol 7", precio: 60000 },
      { texto: "21:00 · Fútbol 7", precio: 65000 },
      { texto: "22:00 · Fútbol 7", precio: 65000 },
    ],
    elegida: 1,
    sena: 12000,
    listo: "¡Reservado!",
    detalle: "Cancha 2 · sáb 21:00",
    panel: "Sábado · 4 canchas",
    columnas: 4,
    grilla: "XXX.XX?XXXXXX.XX",
  },
  pelu: {
    negocio: "Barbería Norte",
    opciones: [
      { texto: "16:30 · Corte", precio: 12000 },
      { texto: "18:00 · Corte y barba", precio: 18000 },
      { texto: "19:00 · Barba", precio: 8000 },
    ],
    elegida: 1,
    sena: 5000,
    listo: "¡Turno confirmado!",
    detalle: "Jue 18:00 con Lucas",
    panel: "Jueves · 3 profesionales",
    columnas: 3,
    grilla: "XX.X?XXXX.XXXX.",
  },
  resto: {
    negocio: "La Esquina",
    opciones: [{ texto: "20:30 · Mesa para 2" }, { texto: "21:30 · Mesa para 4" }, { texto: "22:00 · Mesa para 6" }],
    elegida: 1,
    sena: 10000,
    listo: "¡Mesa reservada!",
    detalle: "Vie 21:30 · 4 personas",
    panel: "Viernes · 12 mesas",
    columnas: 4,
    grilla: "XX.XXX?XX.XX",
  },
};

const ETIQUETA_TAB: Record<ProductoId, string> = {
  cancha: "Cancha",
  pelu: "Peluquería",
  resto: "Restaurante",
};

interface Props {
  indice: number;
  ciclo: number;
  corriendo: boolean;
  reduce: boolean;
  onElegir: (i: number) => void;
}

/** Notebook con la pantalla partida: la misma reserva vista por el cliente y por el dueño. */
export function HeroShowcase({ indice, ciclo, corriendo, reduce, onElegir }: Props) {
  const id = PRODUCTOS[indice].id;
  const pasoTimeline = useTimeline(TIEMPOS, corriendo, ciclo);
  const paso = reduce ? TIEMPOS.length : pasoTimeline;
  const e = ESCENAS[id];

  const celdas = [...e.grilla];
  const ocupadas = celdas.filter((c) => c === "X").length;
  const contador = `${ocupadas + (paso >= 4 ? 1 : 0)}/${celdas.length}`;

  return (
    <div className="showcase" data-producto={id}>
      <div className="showcase__stage">
        <div className="showcase__halo" aria-hidden="true" />

        <div className="notebook" aria-hidden="true">
          <div className="notebook__tapa">
            <div key={`${id}-${ciclo}`} className="notebook__partida">
              {/* Lo que ve el cliente */}
              <div className="pant">
                <div className="pant__top">
                  <span className="pant__negocio">{e.negocio}</span>
                  <span className="pant__rol">Tu cliente</span>
                </div>
                <div className="pant__opciones">
                  {e.opciones.map((o, i) => (
                    <span key={o.texto} className={`pant__opcion ${i === e.elegida && paso >= 1 ? "is-elegida" : ""}`}>
                      <span>{o.texto}</span>
                      {o.precio !== undefined && <span className="mono">{pesos(o.precio)}</span>}
                    </span>
                  ))}
                  <span className={`pant__pagar ${paso === 2 ? "is-apretado" : ""} ${paso >= 1 ? "is-listo" : ""}`}>
                    Pagar seña {pesos(e.sena)}
                  </span>
                </div>
                <div className={`pant__reservado ${paso >= 3 ? "is-visible" : ""}`}>
                  <span className="pant__check">✓</span>
                  <strong>{e.listo}</strong>
                  <small>{e.detalle}</small>
                </div>
              </div>

              {/* Lo que ve el dueño */}
              <div className="pant">
                <div className="pant__top">
                  <span className="pant__rol pant__rol--vos">Vos</span>
                  <span key={contador} className="pant__contador mono">
                    {contador}
                  </span>
                </div>
                <small className="pant__panel">{e.panel}</small>
                <div className="pant__grilla" style={{ gridTemplateColumns: `repeat(${e.columnas}, minmax(0, 1fr))` }}>
                  {celdas.map((c, i) => (
                    <i key={i} className={c === "X" || (c === "?" && paso >= 4) ? `is-ocupada ${c === "?" ? "is-nueva" : ""}` : ""} />
                  ))}
                </div>
              </div>

              <span className={`notebook__viaje ${paso === 3 ? "is-viajando" : ""}`} />
            </div>
          </div>
          <div className="notebook__base" />
        </div>
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
        Demo de {ETIQUETA_TAB[id].toLowerCase()}: tu cliente reserva y paga la seña, y el turno aparece en tu panel.
      </p>
    </div>
  );
}
