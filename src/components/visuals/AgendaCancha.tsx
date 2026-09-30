import { useEffect, useRef, useState } from "react";
import { LuBot, LuGlobe, LuLock, LuPhone, LuPlus, LuTimer } from "react-icons/lu";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import "./visuals.css";

type Estado = "libre" | "pendiente" | "reservado" | "bloqueado";
type Origen = "web" | "tel" | "bot";

interface Celda {
  estado: Estado;
  nombre?: string;
  origen?: Origen;
  minutos?: number;
  motivo?: string;
}

const CANCHAS = [
  { nombre: "Cancha 1", deporte: "Fútbol 7" },
  { nombre: "Cancha 2", deporte: "Fútbol 7" },
  { nombre: "Cancha 3", deporte: "Fútbol 5" },
];

const HORAS = ["19:00", "20:00", "21:00", "22:00"];

const INICIAL: Celda[][] = [
  [
    { estado: "reservado", nombre: "Martín G.", origen: "web" },
    { estado: "reservado", nombre: "Lucía P.", origen: "web" },
    { estado: "libre" },
  ],
  [
    { estado: "reservado", nombre: "Nico R.", origen: "tel" },
    { estado: "pendiente", nombre: "Sofi M.", origen: "web", minutos: 7 },
    { estado: "reservado", nombre: "Tomás B.", origen: "bot" },
  ],
  [{ estado: "bloqueado", motivo: "Torneo" }, { estado: "bloqueado", motivo: "Torneo" }, { estado: "libre" }],
  [{ estado: "libre" }, { estado: "reservado", nombre: "Juli A.", origen: "web" }, { estado: "libre" }],
];

// Lo que va pasando solo mientras mirás la agenda.
const EVENTOS: { h: number; c: number; celda: Celda }[] = [
  { h: 3, c: 0, celda: { estado: "pendiente", nombre: "Fede L.", origen: "web", minutos: 10 } },
  { h: 1, c: 1, celda: { estado: "reservado", nombre: "Sofi M.", origen: "web" } },
  { h: 3, c: 0, celda: { estado: "reservado", nombre: "Fede L.", origen: "web" } },
  { h: 2, c: 2, celda: { estado: "pendiente", nombre: "Caro D.", origen: "bot", minutos: 10 } },
  { h: 0, c: 2, celda: { estado: "reservado", nombre: "Ana V.", origen: "tel" } },
  { h: 2, c: 2, celda: { estado: "reservado", nombre: "Caro D.", origen: "bot" } },
];

const ORIGEN = {
  web: { Icono: LuGlobe, texto: "Página" },
  tel: { Icono: LuPhone, texto: "Teléfono" },
  bot: { Icono: LuBot, texto: "Asistente" },
} as const;

function aplicar(n: number): Celda[][] {
  const grilla = INICIAL.map((fila) => fila.map((c) => ({ ...c })));
  EVENTOS.slice(0, n).forEach((e) => {
    grilla[e.h][e.c] = e.celda;
  });
  return grilla;
}

export function AgendaCancha() {
  const ref = useRef<HTMLDivElement>(null);
  const enVista = useInView(ref);
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!enVista || reduce) return;
    const id = window.setInterval(() => setN((x) => (x >= EVENTOS.length + 1 ? 0 : x + 1)), 2300);
    return () => window.clearInterval(id);
  }, [enVista, reduce]);

  const pasos = Math.min(n, EVENTOS.length);
  const grilla = aplicar(pasos);
  const ultimo = pasos > 0 ? EVENTOS[pasos - 1] : null;
  const todas = grilla.flat();
  const cuenta = (e: Estado) => todas.filter((c) => c.estado === e).length;

  return (
    <div className="ventana" ref={ref} data-producto="cancha">
      <div className="ventana__barra">
        <span className="ventana__puntos" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ventana__titulo">Panel · Agenda del sábado</span>
      </div>

      <div className="agenda">
        <div className="agenda__resumen">
          <span>
            <b className="mono">{cuenta("reservado")}</b> reservados
          </span>
          <span>
            <b className="mono">{cuenta("pendiente")}</b> esperando pago
          </span>
          <span>
            <b className="mono">{cuenta("libre")}</b> libres
          </span>
        </div>

        <div className="agenda__grilla" role="table" aria-label="Agenda de ejemplo">
          <div className="agenda__fila agenda__fila--cabecera" role="row">
            <span role="columnheader" className="agenda__hora" />
            {CANCHAS.map((c) => (
              <span key={c.nombre} role="columnheader" className="agenda__cancha">
                <strong>{c.nombre}</strong>
                <small>{c.deporte}</small>
              </span>
            ))}
          </div>

          {HORAS.map((hora, h) => (
            <div key={hora} className="agenda__fila" role="row">
              <span role="rowheader" className="agenda__hora mono">
                {hora}
              </span>
              {grilla[h].map((celda, c) => {
                const nueva = ultimo !== null && ultimo.h === h && ultimo.c === c;
                return (
                  <CeldaAgenda key={`${c}-${nueva ? pasos : "x"}`} celda={celda} nueva={nueva} />
                );
              })}
            </div>
          ))}
        </div>

        <ul className="agenda__leyenda" aria-label="Referencias">
          <li data-estado="libre">Libre</li>
          <li data-estado="pendiente">Pendiente de pago</li>
          <li data-estado="reservado">Reservado</li>
          <li data-estado="bloqueado">Bloqueado</li>
        </ul>
      </div>
    </div>
  );
}

function CeldaAgenda({ celda, nueva }: { celda: Celda; nueva: boolean }) {
  const clase = `agenda__celda agenda__celda--${celda.estado} ${nueva ? "is-nueva" : ""}`;

  if (celda.estado === "libre") {
    return (
      <span role="cell" className={clase}>
        <LuPlus size={14} aria-hidden="true" />
        <span>Libre</span>
      </span>
    );
  }

  if (celda.estado === "bloqueado") {
    return (
      <span role="cell" className={clase}>
        <LuLock size={13} aria-hidden="true" />
        <span>{celda.motivo}</span>
      </span>
    );
  }

  const origen = celda.origen ? ORIGEN[celda.origen] : null;
  return (
    <span role="cell" className={clase}>
      <strong>{celda.nombre}</strong>
      {celda.estado === "pendiente" ? (
        <small className="mono">
          <LuTimer size={12} aria-hidden="true" />
          {celda.minutos} min
        </small>
      ) : (
        origen && (
          <small>
            <origen.Icono size={12} aria-hidden="true" />
            <span className="agenda__origen">{origen.texto}</span>
          </small>
        )
      )}
    </span>
  );
}
