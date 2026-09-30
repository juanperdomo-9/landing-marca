import { useEffect, useState, type RefObject } from "react";

/**
 * Progreso de 0 a 1 mientras el elemento atraviesa la pantalla:
 * 0 cuando su borde de arriba llega al 80% de la altura, 1 cuando su borde de abajo pasa el 45%.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    let frame = 0;
    const medir = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const alto = window.innerHeight || 1;
      const inicio = alto * 0.8;
      const fin = alto * 0.45;
      const recorrido = r.height + (inicio - fin);
      const p = (inicio - r.top) / recorrido;
      setProgreso(Math.min(1, Math.max(0, p)));
    };
    const pedir = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progreso;
}
