import { useEffect, useState, type CSSProperties } from "react";
import { ETIQUETA_ESTADO, PRODUCTOS, type ProductoId } from "../config";
import "./Cuaderno.css";

interface Nota {
  texto: string;
  tachada?: boolean;
  alerta?: boolean;
}

interface Turno {
  hora: string;
  quien: string;
  estado: string;
}

/** El cuaderno de cada rubro (con sus tachones) y cómo queda en la agenda. Nombres inventados. */
const CUADERNOS: Record<ProductoId, { dia: string; notas: Nota[]; turnos: Turno[] }> = {
  cancha: {
    dia: "Sábado",
    notas: [
      { texto: "Sáb 21hs F7 — Juan (¿pagó?)" },
      { texto: "Martín 20hs", tachada: true },
      { texto: "Martín 21?? preguntar" },
      { texto: "Gonza F5 22hs", tachada: true },
      { texto: "LLAMAR A NICO!!", alerta: true },
    ],
    turnos: [
      { hora: "20:00", quien: "Martín R.", estado: "Seña ✓" },
      { hora: "21:00", quien: "Juan P.", estado: "Seña ✓" },
      { hora: "22:00", quien: "Gonza L.", estado: "Seña ✓" },
    ],
  },
  pelu: {
    dia: "Jueves",
    notas: [
      { texto: "Jue 16:30 Lucas — corte Diego" },
      { texto: "Seba 17hs barba", tachada: true },
      { texto: "Seba 18?? con Vale" },
      { texto: "Fede corte+barba 19", tachada: true },
      { texto: "FEDE NO VINO (otra vez)", alerta: true },
    ],
    turnos: [
      { hora: "16:30", quien: "Diego · Corte", estado: "Seña ✓" },
      { hora: "17:15", quien: "Seba · Barba", estado: "Seña ✓" },
      { hora: "18:00", quien: "Fede · Corte y barba", estado: "Seña ✓" },
    ],
  },
  resto: {
    dia: "Viernes",
    notas: [
      { texto: "Vie mesa x4 — Ana 21hs" },
      { texto: "Carlos 2 milas 21:30", tachada: true },
      { texto: "Carlos retira 22?? llamar" },
      { texto: "Mesa 6 cumple Lau", tachada: true },
      { texto: "¿PAGÓ LAS EMPANADAS??", alerta: true },
    ],
    turnos: [
      { hora: "21:00", quien: "Mesa x4 · Ana", estado: "Seña ✓" },
      { hora: "21:30", quien: "Pedido #127", estado: "Pagado ✓" },
      { hora: "22:00", quien: "Mesa x6 · Lau", estado: "Seña ✓" },
    ],
  },
};

const SALIDA_MS = 420;

/**
 * El antes y después del hero: el cuaderno con tachones y la agenda prolija.
 * Cuando cambia el rubro, el cuaderno sale volando y entra el del rubro nuevo.
 */
export function Cuaderno({ id, reduce }: { id: ProductoId; reduce: boolean }) {
  const [mostrado, setMostrado] = useState(id);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (id === mostrado) return;
    if (reduce) {
      setMostrado(id);
      return;
    }
    setSaliendo(true);
    const t = window.setTimeout(() => {
      setMostrado(id);
      setSaliendo(false);
    }, SALIDA_MS);
    return () => window.clearTimeout(t);
  }, [id, mostrado, reduce]);

  const c = CUADERNOS[mostrado];
  const estado = PRODUCTOS.find((p) => p.id === mostrado)!.estado;

  return (
    <div className={`tirar ${saliendo ? "is-saliendo" : ""}`} data-producto={mostrado} aria-hidden="true">
      <div key={mostrado} className="tirar__par">
        <div className="cuaderno">
          {c.notas.map((n, i) => (
            <p
              key={n.texto}
              className={`${n.tachada ? "cuaderno__tachada" : ""} ${n.alerta ? "cuaderno__alerta" : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              {n.texto}
            </p>
          ))}
        </div>

        <svg className="tirar__flecha" width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h28M22 4l8 8-8 8" />
        </svg>

        <div className="agenda-limpia">
          <div className="agenda-limpia__cabecera">
            <small>{c.dia}</small>
            {estado === "proximamente" && <span>{ETIQUETA_ESTADO[estado]}</span>}
          </div>
          {c.turnos.map((t, i) => (
            <div key={t.hora} className="agenda-limpia__turno" style={{ "--i": i } as CSSProperties}>
              <span className="mono">{t.hora}</span>
              <span>{t.quien}</span>
              <span>{t.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
