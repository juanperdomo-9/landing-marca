import type { ReactNode } from "react";
import "./Phone.css";

/** Marco de celular para las demos. Lo de adentro es ilustrativo. */
export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__screen">
        <div className="phone__status">
          <span className="mono">21:04</span>
          <span className="phone__island" />
          <span className="phone__icons">
            <i className="phone__signal">
              <b />
              <b />
              <b />
              <b />
            </i>
            <i className="phone__battery" />
          </span>
        </div>
        <div className="phone__content">{children}</div>
        <span className="phone__home" />
      </div>
    </div>
  );
}
