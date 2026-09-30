import type { CSSProperties } from "react";
import { pesos } from "../../lib/formato";
import "./visuals.css";

const PROFESIONALES = ["Lucas", "Vale", "Nahuel"];
const DESDE = 14; // 14:00
const HASTA = 19; // 19:00
const MEDIAS_HORAS = (HASTA - DESDE) * 2;

const TURNOS = [
  { pro: 0, hora: 14, min: 30, servicio: "Corte" },
  { pro: 0, hora: 15, min: 45, servicio: "Corte y barba" },
  { pro: 0, hora: 16.5, min: 30, servicio: "Barba" },
  { pro: 0, hora: 18, min: 45, servicio: "Corte y barba", nuevo: true },
  { pro: 1, hora: 14, min: 90, servicio: "Color" },
  { pro: 1, hora: 16, min: 45, servicio: "Brushing" },
  { pro: 1, hora: 17.5, min: 30, servicio: "Corte" },
  { pro: 2, hora: 14.5, min: 30, servicio: "Corte" },
  { pro: 2, hora: 15.5, min: 30, servicio: "Corte" },
  { pro: 2, hora: 17, min: 45, servicio: "Corte y barba" },
];

const SERVICIOS = [
  { nombre: "Corte", min: 30, precio: 12000 },
  { nombre: "Corte y barba", min: 45, precio: 18000 },
  { nombre: "Color", min: 90, precio: 35000 },
];

function hhmm(h: number) {
  const horas = Math.floor(h);
  const minutos = Math.round((h - horas) * 60);
  return `${horas}:${minutos.toString().padStart(2, "0")}`;
}

export function AgendaPelu() {
  return (
    <div className="ventana" data-producto="pelu">
      <div className="ventana__barra">
        <span className="ventana__puntos" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ventana__titulo">Panel · Jueves por profesional</span>
      </div>

      <div className="pelu">
        <div className="pelu__cabecera">
          <span />
          {PROFESIONALES.map((p) => (
            <span key={p} className="pelu__pro">
              <i aria-hidden="true">{p[0]}</i>
              {p}
            </span>
          ))}
        </div>

        <div className="pelu__cuerpo" style={{ "--filas": MEDIAS_HORAS } as CSSProperties}>
          <div className="pelu__horas" aria-hidden="true">
            {Array.from({ length: HASTA - DESDE }, (_, i) => (
              <span key={i} className="mono">
                {DESDE + i}:00
              </span>
            ))}
          </div>
          {PROFESIONALES.map((p, pi) => (
            <div key={p} className="pelu__columna" aria-label={`Turnos de ${p}`}>
              {TURNOS.filter((t) => t.pro === pi).map((t) => (
                <span
                  key={`${t.hora}`}
                  className={`pelu__turno ${t.nuevo ? "is-nuevo" : ""} ${t.min <= 30 ? "is-corto" : ""}`}
                  style={
                    {
                      "--inicio": (t.hora - DESDE) * 2,
                      "--largo": t.min / 30,
                    } as CSSProperties
                  }
                >
                  <strong>{t.servicio}</strong>
                  <small className="mono">
                    {hhmm(t.hora)} · {t.min} min
                  </small>
                  {t.nuevo && <em>Nuevo</em>}
                </span>
              ))}
            </div>
          ))}
        </div>

        <ul className="pelu__servicios">
          {SERVICIOS.map((s) => (
            <li key={s.nombre}>
              <span>{s.nombre}</span>
              <span className="mono">{s.min} min</span>
              <span className="mono">{pesos(s.precio)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
