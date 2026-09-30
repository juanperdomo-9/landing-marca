import type { ReactNode } from "react";
import { LuBadgeCheck, LuSend } from "react-icons/lu";
import "./demos.css";

interface Mensaje {
  id: string;
  de: "bot" | "yo" | "sistema";
  contenido: ReactNode;
}

/**
 * Pasos: 0 saludo · 1 pregunta · 2 escribiendo · 3 respuesta · 4 elige 18:00 · 5 escribiendo · 6 link de seña · 7 aprobado
 */
export function DemoPeluqueria({ paso }: { paso: number }) {
  const mensajes: Mensaje[] = [
    { id: "hola", de: "bot", contenido: "¡Hola! Soy el asistente de Barbería Norte. ¿En qué te ayudo?" },
  ];
  if (paso >= 1) mensajes.push({ id: "q1", de: "yo", contenido: "¿Tenés turno para corte y barba el jueves?" });
  if (paso >= 3)
    mensajes.push({
      id: "r1",
      de: "bot",
      contenido: (
        <>
          Sí. El jueves hay lugar a las <b>16:30</b> y a las <b>18:00</b> con Lucas. Corte y barba sale{" "}
          <b>$18.000</b> y dura 45 minutos.
          <span className="demo__opciones">
            <span>16:30</span>
            <span className={paso >= 4 ? "is-on" : ""}>18:00</span>
          </span>
        </>
      ),
    });
  if (paso >= 4) mensajes.push({ id: "q2", de: "yo", contenido: "A las 18" });
  if (paso >= 6)
    mensajes.push({
      id: "r2",
      de: "bot",
      contenido: (
        <>
          Listo, te lo guardo 10 minutos. Para confirmarlo, pagá la seña:
          <span className="demo__link-pago">
            <span>
              <small>Seña · Jue 18:00</small>
              <b className="mono">$5.000</b>
            </span>
            <span className="demo__link-btn">Pagar</span>
          </span>
        </>
      ),
    });
  if (paso >= 7)
    mensajes.push({
      id: "ok",
      de: "sistema",
      contenido: (
        <>
          <LuBadgeCheck size={15} /> Pago aprobado. Turno confirmado: jueves 18:00 con Lucas.
        </>
      ),
    });

  const escribiendo = paso === 2 || paso === 5;

  return (
    <div className="demo demo--chat" data-producto="pelu">
      <header className="demo__negocio demo__negocio--chat">
        <span className="demo__avatar">BN</span>
        <span>
          <strong>Barbería Norte</strong>
          <small className="demo__online">Asistente en línea</small>
        </span>
      </header>

      <div className="demo__mensajes">
        {mensajes.map((m) => (
          <div key={m.id} className={`demo__msg demo__msg--${m.de}`}>
            {m.contenido}
          </div>
        ))}
        {escribiendo && (
          <div className="demo__msg demo__msg--bot demo__escribiendo" aria-label="Escribiendo">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>

      <div className="demo__input">
        <span>Escribí tu consulta…</span>
        <span className="demo__enviar">
          <LuSend size={14} />
        </span>
      </div>
    </div>
  );
}
