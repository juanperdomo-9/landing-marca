import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Lleva un número hacia `objetivo` con una animación corta. */
export function useAnimatedNumber(objetivo: number, duracion = 550): number {
  const reduce = useReducedMotion();
  const [valor, setValor] = useState(objetivo);
  const actual = useRef(objetivo);

  useEffect(() => {
    if (reduce) {
      actual.current = objetivo;
      setValor(objetivo);
      return;
    }
    const desde = actual.current;
    const inicio = performance.now();
    let frame = 0;
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - t, 3);
      const v = desde + (objetivo - desde) * suave;
      actual.current = v;
      setValor(v);
      if (t < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [objetivo, duracion, reduce]);

  return valor;
}
