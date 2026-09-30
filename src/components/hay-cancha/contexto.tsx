import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LuArrowUpRight, LuPlay } from "react-icons/lu";
import { HAY_CANCHA } from "../../config";

const DemoHayCancha = lazy(() => import("./DemoHayCancha"));

/** Ancla para abrir la demo directo desde un link (por ejemplo, al compartirla). */
export const ANCLA_DEMO = "probar-hay-cancha";

const AbrirDemo = createContext<() => void>(() => {});

export function DemoHayCanchaProvider({ children }: { children: ReactNode }) {
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const revisar = () => {
      if (window.location.hash === `#${ANCLA_DEMO}`) setAbierta(true);
    };
    revisar();
    window.addEventListener("hashchange", revisar);
    return () => window.removeEventListener("hashchange", revisar);
  }, []);

  const abrir = useCallback(() => setAbierta(true), []);

  const cerrar = useCallback(() => {
    setAbierta(false);
    if (window.location.hash === `#${ANCLA_DEMO}`) {
      try {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch {
        // Si el navegador no deja tocar la dirección, no pasa nada.
      }
    }
  }, []);

  return (
    <AbrirDemo.Provider value={abrir}>
      {children}
      {abierta && (
        <Suspense fallback={null}>
          <DemoHayCancha onCerrar={cerrar} />
        </Suspense>
      )}
    </AbrirDemo.Provider>
  );
}

interface BotonProps {
  className?: string;
  /**
   * "web": lleva a la web real de Hay Cancha (si no hay dirección cargada, abre la demo).
   * "demo": siempre abre la demo del complejo de ejemplo.
   */
  modo?: "web" | "demo";
  textoDemo?: string;
  textoWeb?: string;
  conIcono?: boolean;
  onClick?: () => void;
}

/** Botón para ver Hay Cancha: la web real o la demo navegable. */
export function BotonHayCancha({
  className,
  modo = "demo",
  textoDemo = "Probá cómo se reserva",
  textoWeb = "Ver Hay Cancha",
  conIcono = true,
  onClick,
}: BotonProps) {
  const abrir = useContext(AbrirDemo);

  if (modo === "web" && HAY_CANCHA.url) {
    return (
      <a className={className} href={HAY_CANCHA.url} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {textoWeb}
        {conIcono && <LuArrowUpRight aria-hidden="true" />}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        onClick?.();
        abrir();
      }}
    >
      {conIcono && <LuPlay aria-hidden="true" />}
      {textoDemo}
    </button>
  );
}
