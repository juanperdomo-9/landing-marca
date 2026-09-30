import { useEffect, type CSSProperties } from "react";

/**
 * Hace aparecer los elementos con `data-reveal` cuando entran en pantalla.
 * Valores: "up", "down", "left", "right", "zoom", "tilt-left", "tilt-right", "rise" (ver styles/reveal.css).
 * También toma los que se montan después (por ejemplo, al cambiar de pestaña en Productos).
 * Si el visitante pidió menos movimiento, no hace nada y todo se ve desde el principio.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const raiz = document.documentElement;
    raiz.classList.add("reveal-on");

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const observar = (el: Element) => {
      if (el.matches("[data-reveal]:not([data-revealed])")) io.observe(el);
      el.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((hijo) => io.observe(hijo));
    };

    observar(document.body);

    const mo = new MutationObserver((cambios) => {
      for (const c of cambios) c.addedNodes.forEach((n) => n instanceof Element && observar(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      raiz.classList.remove("reveal-on");
    };
  }, []);
}

/** Retraso de la aparición, para escalonar elementos hermanos. */
export function retraso(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
