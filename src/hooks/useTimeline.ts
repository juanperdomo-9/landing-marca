import { useEffect, useState } from "react";

/**
 * Avanza un contador de pasos según una lista de tiempos (en ms desde el inicio).
 * Devuelve 0 al empezar y tiempos.length al final.
 * Arranca de nuevo cada vez que cambia `reinicio` (y nunca muestra un paso de la vuelta anterior).
 */
export function useTimeline(tiempos: readonly number[], activo: boolean, reinicio: number = 0): number {
  const [estado, setEstado] = useState({ paso: 0, reinicio });

  useEffect(() => {
    if (!activo) return;
    setEstado({ paso: 0, reinicio });
    const ids = tiempos.map((t, i) => window.setTimeout(() => setEstado({ paso: i + 1, reinicio }), t));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // `tiempos` es una constante de cada demo: no hace falta seguirla.
  }, [activo, reinicio]); // eslint-disable-line react-hooks/exhaustive-deps

  return estado.reinicio === reinicio ? estado.paso : 0;
}
