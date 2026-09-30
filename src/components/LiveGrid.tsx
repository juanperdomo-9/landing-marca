import { useEffect, useState, type CSSProperties } from "react";
import type { ProductoId } from "../config";
import "./LiveGrid.css";

const COLUMNAS = 18;
const FILAS = 14;
const TOTAL = COLUMNAS * FILAS;
const MAXIMO = 18;
const IDS: ProductoId[] = ["cancha", "pelu", "resto"];

// Arranque fijo para que la primera imagen siempre sea la misma.
const INICIALES: [number, ProductoId][] = [
  [13, "cancha"],
  [30, "pelu"],
  [47, "resto"],
  [52, "cancha"],
  [68, "cancha"],
  [85, "pelu"],
  [99, "resto"],
  [104, "cancha"],
  [121, "pelu"],
  [139, "cancha"],
  [158, "resto"],
  [176, "cancha"],
];

/** Fondo del hero: una grilla de turnos que se van ocupando solos. */
export function LiveGrid({ activo }: { activo: boolean }) {
  const [ocupadas, setOcupadas] = useState(() => new Map<number, ProductoId>(INICIALES));

  useEffect(() => {
    if (!activo) return;
    const id = window.setInterval(() => {
      setOcupadas((previas) => {
        const nuevas = new Map(previas);
        if (nuevas.size >= MAXIMO) {
          const primera = nuevas.keys().next().value;
          if (primera !== undefined) nuevas.delete(primera);
        }
        let celda = Math.floor(Math.random() * TOTAL);
        while (nuevas.has(celda)) celda = (celda + 7) % TOTAL;
        nuevas.set(celda, IDS[Math.floor(Math.random() * IDS.length)]);
        return nuevas;
      });
    }, 700);
    return () => window.clearInterval(id);
  }, [activo]);

  return (
    <div className="livegrid" aria-hidden="true" style={{ "--columnas": COLUMNAS } as CSSProperties}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const producto = ocupadas.get(i);
        return <span key={i} className={producto ? "is-on" : undefined} data-producto={producto} />;
      })}
    </div>
  );
}
