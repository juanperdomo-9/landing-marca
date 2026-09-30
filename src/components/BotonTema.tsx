import { useEffect, useState, type MouseEvent } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { elegirTema, temaActual, temaGuardado, type Tema } from "../lib/tema";

/**
 * Cambia entre modo claro y oscuro. Arranca con el del sistema del visitante
 * y, cuando elige uno, se recuerda para la próxima visita.
 * El cambio se ve como un círculo que se expande desde el botón.
 */
export function BotonTema({ className = "" }: { className?: string }) {
  const [tema, setTema] = useState<Tema>(temaActual);

  // Mientras el visitante no eligió, sigue los cambios del sistema.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const alCambiar = () => {
      if (!temaGuardado()) setTema(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  const cambiar = (e: MouseEvent<HTMLButtonElement>) => {
    const nuevo: Tema = tema === "dark" ? "light" : "dark";
    const aplicar = () => {
      elegirTema(nuevo);
      setTema(nuevo);
    };

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("startViewTransition" in document)) {
      aplicar();
      return;
    }

    // Con teclado no hay posición del mouse: el círculo sale del centro del botón.
    const caja = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || caja.left + caja.width / 2;
    const y = e.clientY || caja.top + caja.height / 2;
    const radio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transicion = document.startViewTransition(aplicar);
    transicion.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  const oscuro = tema === "dark";

  return (
    <button
      type="button"
      className={className}
      onClick={cambiar}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
    >
      <span key={tema} className="tema__icono">
        {oscuro ? <LuSun size={20} /> : <LuMoon size={20} />}
      </span>
    </button>
  );
}
