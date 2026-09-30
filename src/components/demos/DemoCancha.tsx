import { LuCheck, LuLoaderCircle, LuMail } from "react-icons/lu";
import { pesos } from "../../lib/formato";
import "./demos.css";

const DEPORTES = ["Fútbol 7", "Fútbol 5", "Pádel"];
const DIAS = ["Hoy", "Mañana", "Sáb", "Dom"];
const TURNOS = [
  { hora: "19:00", precio: 60000, libres: 2 },
  { hora: "20:00", precio: 60000, libres: 0 },
  { hora: "21:00", precio: 65000, libres: 3 },
  { hora: "22:00", precio: 65000, libres: 1 },
  { hora: "23:00", precio: 60000, libres: 4 },
];
const ELEGIDO = "21:00";
const SENA = 15000;

/**
 * Pasos: 0 lista de horarios · 1 toca las 21 · 2 resumen y seña · 3 esperando el pago · 4 confirmado
 */
export function DemoCancha({ paso }: { paso: number }) {
  const turno = TURNOS.find((t) => t.hora === ELEGIDO)!;

  return (
    <div className="demo" data-producto="cancha">
      <header className="demo__negocio">
        <span className="demo__avatar">EP</span>
        <span>
          <strong>Complejo El Potrero</strong>
          <small>Fútbol 5 · Fútbol 7 · Pádel</small>
        </span>
      </header>

      <div className="demo__chips">
        {DEPORTES.map((d, i) => (
          <span key={d} className={`demo__chip ${i === 0 ? "is-on" : ""}`}>
            {d}
          </span>
        ))}
      </div>

      <div className="demo__dias">
        {DIAS.map((d, i) => (
          <span key={d} className={i === 0 ? "is-on" : ""}>
            {d}
          </span>
        ))}
      </div>

      <p className="demo__titulo">Elegí un horario</p>
      <ul className="demo__turnos">
        {TURNOS.map((t) => {
          const lleno = t.libres === 0;
          const elegido = paso >= 1 && t.hora === ELEGIDO;
          return (
            <li key={t.hora} className={`demo__turno ${lleno ? "is-lleno" : ""} ${elegido ? "is-elegido" : ""}`}>
              <span className="mono demo__hora">{t.hora}</span>
              <span className="demo__quedan">
                {lleno ? "Completo" : t.libres === 1 ? "Queda 1 cancha" : `Quedan ${t.libres} canchas`}
              </span>
              <span className="mono demo__precio">{pesos(t.precio)}</span>
              {elegido && paso === 1 && <span className="demo__tap" />}
            </li>
          );
        })}
      </ul>

      <p className="demo__pie">
        <span className="mono">{pesos(SENA)}</span> de seña para reservar. El resto lo pagás en la cancha.
      </p>

      <div className={`demo__sheet ${paso >= 2 && paso < 4 ? "is-abierto" : ""}`}>
        <span className="demo__agarre" />
        <strong className="demo__sheet-titulo">Fútbol 7 · Hoy {ELEGIDO}</strong>
        <small className="demo__sheet-sub">60 min · te asignamos la primera cancha libre</small>
        <dl className="demo__cuenta">
          <div>
            <dt>Turno</dt>
            <dd className="mono">{pesos(turno.precio)}</dd>
          </div>
          <div>
            <dt>Seña online</dt>
            <dd className="mono">{pesos(SENA)}</dd>
          </div>
          <div>
            <dt>Pagás en la cancha</dt>
            <dd className="mono">{pesos(turno.precio - SENA)}</dd>
          </div>
        </dl>
        <span className={`demo__pagar ${paso >= 3 ? "is-cargando" : ""}`}>
          {paso >= 3 ? (
            <>
              <LuLoaderCircle className="demo__spin" size={16} /> Esperando el pago…
            </>
          ) : (
            "Pagar seña con Mercado Pago"
          )}
        </span>
        <small className="demo__nota mono">Tenés 10 minutos para pagar</small>
      </div>

      <div className={`demo__exito ${paso >= 4 ? "is-visible" : ""}`}>
        <span className="demo__check">
          <LuCheck size={30} strokeWidth={3} />
        </span>
        <strong>¡Turno confirmado!</strong>
        <span className="demo__exito-det">
          Fútbol 7 · Cancha 2
          <br />
          Hoy a las {ELEGIDO}
        </span>
        <span className="demo__recibo">
          <span>Seña pagada</span>
          <span className="mono">{pesos(SENA)}</span>
        </span>
        <small className="demo__mail">
          <LuMail size={14} /> Te mandamos la confirmación por email
        </small>
      </div>
    </div>
  );
}
