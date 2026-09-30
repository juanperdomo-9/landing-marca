import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  LuCircleAlert,
  LuInbox,
  LuRotateCcw,
  LuSend,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { retraso } from "../hooks/useReveal";
import "./AssistantDemo.css";

type Clave = "precio" | "lugar" | "estacionamiento" | "cancelar" | "reservar" | "nose";
type Extra = "reservar" | "pago" | "guardada";

interface Mensaje {
  id: number;
  de: "bot" | "yo";
  texto: string;
  extra?: Extra;
}

const RESPUESTAS: Record<Clave, { texto: string; extra?: Extra }> = {
  precio: {
    texto:
      "El fútbol 7 sale $60.000 la hora, y $65.000 desde las 21. Para reservar pagás una seña de $15.000 con Mercado Pago y el resto en la cancha.",
  },
  lugar: {
    texto: "Hoy a las 21 quedan 2 canchas de fútbol 7 y 1 de fútbol 5. ¿Querés que te aparte una?",
    extra: "reservar",
  },
  estacionamiento: {
    texto: "Sí, hay estacionamiento gratis para clientes en el playón que está al lado de la entrada.",
  },
  cancelar: {
    texto:
      "Podés cancelar desde el link de tu reserva. Si faltan más de 24 horas, la seña vuelve sola a tu Mercado Pago; con menos, se pierde.",
  },
  reservar: {
    texto: "Listo: te aparté la Cancha 2 de fútbol 7, hoy a las 21, por 10 minutos. Pagá la seña para confirmarla:",
    extra: "pago",
  },
  nose: {
    texto: "Esa no la sé todavía, y prefiero no inventarte nada. Le dejé tu pregunta al complejo para que la responda.",
    extra: "guardada",
  },
};

const SUGERENCIAS: { texto: string; clave: Clave }[] = [
  { texto: "¿Cuánto sale el fútbol 7?", clave: "precio" },
  { texto: "¿Hay lugar hoy a las 21?", clave: "lugar" },
  { texto: "¿Tienen estacionamiento?", clave: "estacionamiento" },
  { texto: "¿Alquilan pelotas?", clave: "nose" },
  { texto: "¿Cómo cancelo un turno?", clave: "cancelar" },
];

// La charla arranca con un ejemplo, así se entiende la idea sin tocar nada.
const INICIALES: Mensaje[] = [
  {
    id: 0,
    de: "bot",
    texto: "¡Hola! Soy el asistente del Complejo El Potrero. Preguntame por precios, horarios o cómo reservar.",
  },
  { id: 1, de: "yo", texto: "¿Cuánto sale el fútbol 7?" },
  { id: 2, de: "bot", ...RESPUESTAS.precio },
];

/** Adivina la intención de lo que escribió el usuario (solo para la demo). */
function clasificar(texto: string): Clave {
  const t = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  if (/cancel|devol|reembols/.test(t)) return "cancelar";
  if (/reserv|apart|agend|^si\b|^dale\b/.test(t)) return "reservar";
  if (/estacion|auto|coche|parking|moto/.test(t)) return "estacionamiento";
  if (/precio|sale|cuesta|cuanto|valor|sena|cobran/.test(t)) return "precio";
  if (/lugar|libre|disponib|turno|hora|hoy|manana|noche/.test(t)) return "lugar";
  return "nose";
}

export function AssistantDemo() {
  const reduce = useReducedMotion();
  const [mensajes, setMensajes] = useState<Mensaje[]>(INICIALES);
  const [escribiendo, setEscribiendo] = useState(false);
  const [stream, setStream] = useState<{ id: number; n: number } | null>(null);
  const [entrada, setEntrada] = useState("");
  const lista = useRef<HTMLDivElement>(null);
  const proximoId = useRef(INICIALES.length);
  const timeouts = useRef<number[]>([]);

  const ocupado = escribiendo || stream !== null;

  // Deja la conversación siempre abajo, sin mover la página.
  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes, escribiendo, stream]);

  // Escribe la respuesta de a poco.
  useEffect(() => {
    if (!stream) return;
    const mensaje = mensajes.find((m) => m.id === stream.id);
    if (!mensaje) return;
    if (stream.n >= mensaje.texto.length) {
      setStream(null);
      return;
    }
    const id = window.setTimeout(() => setStream({ id: stream.id, n: stream.n + 3 }), 18);
    return () => window.clearTimeout(id);
  }, [stream, mensajes]);

  useEffect(() => () => timeouts.current.forEach((id) => window.clearTimeout(id)), []);

  const preguntar = (texto: string, clave: Clave) => {
    if (ocupado || !texto.trim()) return;
    const pregunta: Mensaje = { id: proximoId.current++, de: "yo", texto: texto.trim() };
    setMensajes((m) => [...m, pregunta]);
    setEscribiendo(true);

    const respuesta: Mensaje = { id: proximoId.current++, de: "bot", ...RESPUESTAS[clave] };
    const id = window.setTimeout(
      () => {
        setEscribiendo(false);
        setMensajes((m) => [...m, respuesta]);
        if (!reduce) setStream({ id: respuesta.id, n: 0 });
      },
      reduce ? 150 : 850,
    );
    timeouts.current.push(id);
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ocupado || !entrada.trim()) return;
    preguntar(entrada, clasificar(entrada));
    setEntrada("");
  };

  const reiniciar = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
    setMensajes(INICIALES);
    setEscribiendo(false);
    setStream(null);
  };

  return (
    <section id="asistente" className="section asistente">
      <div className="container asistente__inner">
        <div className="asistente__copy" data-reveal="left">
          <h2>Responde como vos, a cualquier hora</h2>
          <p className="asistente__lead">
            Contesta con lo que vos cargás: precios, horarios, cómo llegar, qué incluye el turno. Y cuando alguien
            quiere reservar, le aparta el horario y le pasa el link de pago.
          </p>
          <ul className="asistente__puntos">
            <li>
              <span className="asistente__icono">
                <LuSparkles size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Aprende de tu negocio.</strong> Le cargás la información una vez y la usa para responder.
              </span>
            </li>
            <li>
              <span className="asistente__icono">
                <LuCircleAlert size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Si no sabe, no inventa.</strong> Te deja la pregunta en el panel para que la completes.
              </span>
            </li>
            <li>
              <span className="asistente__icono">
                <LuShieldCheck size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Nunca confirma un pago.</strong> El turno se confirma solo cuando Mercado Pago aprueba el
                pago.
              </span>
            </li>
          </ul>
        </div>

        <div className="chat" data-reveal="tilt-right" style={retraso(150)}>
          <div className="chat__cabecera">
            <span className="chat__avatar">EP</span>
            <span className="chat__quien">
              <strong>Asistente de El Potrero</strong>
              <small>{ocupado ? "Escribiendo…" : "En línea"}</small>
            </span>
            <span className="chat__demo mono">Demo</span>
            <button type="button" className="chat__reiniciar" onClick={reiniciar} aria-label="Reiniciar la demo">
              <LuRotateCcw size={16} />
            </button>
          </div>

          <div className="chat__mensajes" ref={lista} aria-live="polite">
            {mensajes.map((m) => {
              const enCurso = stream?.id === m.id;
              const texto = enCurso ? m.texto.slice(0, stream!.n) : m.texto;
              return (
                <div key={m.id} className={`chat__msg chat__msg--${m.de}`}>
                  <p>{texto}</p>
                  {!enCurso && m.extra === "reservar" && (
                    <button
                      type="button"
                      className="chat__accion"
                      disabled={ocupado}
                      onClick={() => preguntar("Sí, apartame una de fútbol 7", "reservar")}
                    >
                      Sí, apartame una de fútbol 7
                    </button>
                  )}
                  {!enCurso && m.extra === "pago" && (
                    <div className="chat__pago">
                      <div className="chat__pago-fila">
                        <span>
                          <small>Seña · Fútbol 7 · Hoy 21:00</small>
                          <b className="mono">$15.000</b>
                        </span>
                        <span className="chat__pago-btn">Pagar con Mercado Pago</span>
                      </div>
                      <small className="chat__pago-nota">
                        <LuShieldCheck size={13} aria-hidden="true" /> Se confirma cuando Mercado Pago aprueba el pago.
                      </small>
                    </div>
                  )}
                  {!enCurso && m.extra === "guardada" && (
                    <span className="chat__guardada">
                      <LuInbox size={13} aria-hidden="true" /> Pregunta guardada para el dueño
                    </span>
                  )}
                </div>
              );
            })}
            {escribiendo && (
              <div className="chat__msg chat__msg--bot chat__escribiendo" aria-label="El asistente está escribiendo">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          <div className="chat__sugerencias" aria-label="Preguntas de ejemplo">
            {SUGERENCIAS.map((s) => (
              <button key={s.texto} type="button" disabled={ocupado} onClick={() => preguntar(s.texto, s.clave)}>
                {s.texto}
              </button>
            ))}
          </div>

          <form className="chat__form" onSubmit={enviar}>
            <label htmlFor="chat-entrada" className="sr-only">
              Escribí una pregunta
            </label>
            <input
              id="chat-entrada"
              value={entrada}
              maxLength={200}
              autoComplete="off"
              placeholder="Escribí una pregunta…"
              onChange={(e) => setEntrada(e.target.value)}
            />
            <button type="submit" disabled={ocupado || !entrada.trim()} aria-label="Enviar">
              <LuSend size={17} />
            </button>
          </form>
        </div>
      </div>
      <p className="container asistente__aviso">
        Demo con respuestas de ejemplo de un complejo inventado. El asistente real responde con la información de
        cada negocio.
      </p>
    </section>
  );
}
