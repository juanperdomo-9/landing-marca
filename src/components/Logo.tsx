import { MARCA } from "../config";
import "./Logo.css";

/** Isotipo: una grilla de cuatro turnos con uno reservado. */
export function Logo({ tamano = 28 }: { tamano?: number }) {
  return (
    <span className="logo">
      <svg viewBox="0 0 32 32" width={tamano} height={tamano} aria-hidden="true" className="logo__mark">
        <rect x="3" y="3" width="12" height="12" rx="3.5" className="logo__cell" />
        <rect x="17" y="3" width="12" height="12" rx="3.5" className="logo__cell logo__cell--on" />
        <rect x="3" y="17" width="12" height="12" rx="3.5" className="logo__cell" />
        <rect x="17" y="17" width="12" height="12" rx="3.5" className="logo__cell" />
      </svg>
      <span className="logo__text">{MARCA.nombre}</span>
    </span>
  );
}
