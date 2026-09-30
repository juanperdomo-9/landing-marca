import { useEffect, useState, type RefObject } from "react";

/**
 * true mientras el elemento esté en pantalla.
 * Se usa solo para pausar animaciones fuera de vista: nunca para esconder contenido.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px"): boolean {
  const [enVista, setEnVista] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entrada]) => setEnVista(entrada.isIntersecting), { rootMargin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);

  return enVista;
}
