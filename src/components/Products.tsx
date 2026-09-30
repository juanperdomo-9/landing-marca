import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { ETIQUETA_ESTADO, PRODUCTOS, type ProductoId } from "../config";
import { retraso } from "../hooks/useReveal";
import { IconoProducto } from "./icons";
import { BotonHayCancha } from "./hay-cancha/contexto";
import { AgendaCancha } from "./visuals/AgendaCancha";
import { AgendaPelu } from "./visuals/AgendaPelu";
import { Comanda } from "./visuals/Comanda";
import "./Products.css";

interface Detalle {
  titulo: string;
  descripcion: string;
  funciones: string[];
  cta: string;
  Visual: ComponentType;
}

const DETALLE: Record<ProductoId, Detalle> = {
  cancha: {
    titulo: "Tu complejo, reservando solo",
    descripcion:
      "Los jugadores ven qué canchas quedan libres, reservan y pagan la seña sin escribirte. Vos mirás todo desde la agenda en el celular, aunque estés en la cancha.",
    funciones: [
      "Fútbol 5, 7 y 11, pádel, tenis, básquet y vóley: cada cancha con su duración y su precio",
      "Seña con Mercado Pago: el turno se confirma solo cuando el pago está aprobado",
      "Agenda del día con libres, pendientes, reservados y bloqueados",
      "Reservas por teléfono y bloqueos por torneo o lluvia, sin que se pisen con las online",
      "Asistente con IA que responde consultas y aparta turnos",
    ],
    cta: "Quiero Hay Cancha",
    Visual: AgendaCancha,
  },
  pelu: {
    titulo: "Cada servicio con su duración, cada profesional con su agenda",
    descripcion:
      "Tus clientes eligen servicio, profesional y horario, y dejan la seña. Se terminan los mensajes de «¿tenés lugar mañana?» y los turnos que nadie avisa que no vienen.",
    funciones: [
      "Servicios con su duración y su precio: corte, barba, color",
      "Agenda separada por profesional",
      "Seña para que no se te caigan turnos",
      "Recordatorio por email antes del turno",
      "Asistente que responde precios y horarios",
    ],
    cta: "Avisame cuando salga",
    Visual: AgendaPelu,
  },
  resto: {
    titulo: "Pedidos y reservas que llegan pagados",
    descripcion:
      "Reservas de mesa y pedidos para retirar, pagados antes. La cocina ve lo que entra y el asistente contesta las preguntas de siempre.",
    funciones: [
      "Carta online que actualizás vos",
      "Pedidos para retirar, pagados con Mercado Pago",
      "Reservas de mesa con horario y cantidad de personas",
      "El asistente responde horarios, carta y opciones sin TACC",
    ],
    cta: "Avisame cuando salga",
    Visual: Comanda,
  },
};

export function Products() {
  const [activo, setActivo] = useState<ProductoId>("cancha");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const detalle = DETALLE[activo];
  const producto = PRODUCTOS.find((p) => p.id === activo)!;

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = PRODUCTOS.findIndex((p) => p.id === activo);
    let siguiente = -1;
    if (e.key === "ArrowRight") siguiente = (i + 1) % PRODUCTOS.length;
    if (e.key === "ArrowLeft") siguiente = (i - 1 + PRODUCTOS.length) % PRODUCTOS.length;
    if (siguiente < 0) return;
    e.preventDefault();
    setActivo(PRODUCTOS[siguiente].id);
    tabs.current[siguiente]?.focus();
  };

  return (
    <section id="productos" className="section productos">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="left">
            <b>01</b> Productos
          </p>
          <h2 data-reveal="up" style={retraso(80)}>
            Una marca, un producto para cada rubro
          </h2>
          <p data-reveal="up" style={retraso(160)}>
            El mismo motor de reservas, cobros y atención automática, hecho a medida de cada negocio. Arrancamos por
            las canchas y vamos sumando rubros.
          </p>
        </div>

        <div className="productos__tabs" role="tablist" aria-label="Productos" onKeyDown={alTeclear}>
          {PRODUCTOS.map((p, i) => {
            const on = p.id === activo;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`tab-${p.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${p.id}`}
                tabIndex={on ? 0 : -1}
                data-producto={p.id}
                data-reveal="up"
                style={retraso(i * 100)}
                className={`productos__tab ${on ? "is-activo" : ""}`}
                onClick={() => setActivo(p.id)}
              >
                <span className="productos__tab-icono">
                  <IconoProducto id={p.id} size={20} />
                </span>
                <span className="productos__tab-texto">
                  <strong>{p.nombre}</strong>
                  <small>{p.rubro}</small>
                </span>
                <span className={`badge ${p.estado === "lanzamiento" ? "badge--live" : ""}`}>
                  {ETIQUETA_ESTADO[p.estado]}
                </span>
              </button>
            );
          })}
        </div>

        <div
          key={activo}
          id={`panel-${activo}`}
          role="tabpanel"
          aria-labelledby={`tab-${activo}`}
          className="productos__panel"
          data-producto={activo}
        >
          <div className="productos__info" data-reveal="left">
            <p className="productos__nombre">
              <IconoProducto id={activo} size={18} />
              {producto.nombre}
            </p>
            <h3>{detalle.titulo}</h3>
            <p className="productos__desc">{detalle.descripcion}</p>
            <ul className="productos__lista">
              {detalle.funciones.map((f) => (
                <li key={f}>
                  <span className="productos__check" aria-hidden="true">
                    <LuCheck size={14} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="productos__ctas">
              {activo === "cancha" ? (
                <>
                  <BotonHayCancha className="btn btn--accent" textoDemo="Probá la página de un complejo" />
                  <BotonHayCancha modo="web" className="btn btn--ghost" textoWeb="Ver la web de Hay Cancha" />
                </>
              ) : (
                <a className="btn btn--ghost" href="#contacto">
                  {detalle.cta} <LuArrowRight aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
          <div className="productos__visual" data-reveal="right" style={retraso(120)}>
            <detalle.Visual />
          </div>
        </div>
      </div>
    </section>
  );
}
