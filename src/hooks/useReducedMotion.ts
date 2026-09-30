import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** true si el usuario pidió menos animaciones en su sistema. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(QUERY).matches : false,
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const alCambiar = () => setReduce(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  return reduce;
}
