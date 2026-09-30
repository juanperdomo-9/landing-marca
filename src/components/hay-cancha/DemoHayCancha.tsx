import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  LuArrowLeft,
  LuArrowUpRight,
  LuCheck,
  LuClock,
  LuLoaderCircle,
  LuLock,
  LuMail,
  LuMapPin,
  LuShieldCheck,
  LuTimerOff,
  LuX,
} from "react-icons/lu";
import { HAY_CANCHA } from "../../config";
import { pesos } from "../../lib/formato";
import { IconoPelota } from "../icons";
import {
  COMPLEJO,
  DEPORTES,
  horaFin,
  ocupadaDeBase,
  proximosDias,
  yaPaso,
  type Cancha,
  type DeporteId,
} from "./datos";
import "./DemoHayCancha.css";

type Paso = "elegir" | "datos" | "pago" | "estado";
type EstadoReserva = "pendiente_pago" | "confirmada" | "vencida";

interface Reserva {
  codigo: string;
  deporte: DeporteId;
  dia: number;
  hora: string;
  cancha: string;
  estado: EstadoReserva;
  venceA: number;
}

interface Datos {
  nombre: string;
  telefono: string;
  email: string;
}

type Errores = Partial<Record<keyof Datos, string>>;

function validar(d: Datos): Errores {
  const e: Errores = {};
  if (d.nombre.trim().length < 2) e.nombre = "Poné tu nombre.";
  if (d.telefono.replace(/\D/g, "").length < 8) e.telefono = "Poné un celular válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Poné un email válido.";
  return e;
}

function codigoNuevo(): string {
  return Math.random().toString(36).slice(2, 8);
}

function mmss(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function DemoHayCancha({ onCerrar }: { onCerrar: () => void }) {
  const dias = useMemo(() => proximosDias(7), []);
  const [deporteId, setDeporteId] = useState<DeporteId>("f7");
  const [diaIndice, setDiaIndice] = useState(0);
  const [hora, setHora] = useState<string | null>(null);
  const [canchaElegida, setCanchaElegida] = useState<string>("cualquiera");
  const [paso, setPaso] = useState<Paso>("elegir");
  const [datos, setDatos] = useState<Datos>({ nombre: "", telefono: "", email: "" });
  const [errores, setErrores] = useState<Errores>({});
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [actual, setActual] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());

  const cerrarRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const deporte = DEPORTES.find((d) => d.id === deporteId)!;
  const dia = dias[diaIndice];
  const reservaActual = reservas.find((r) => r.codigo === actual) ?? null;

  // Abrir: bloquear el scroll de la página, enfocar el botón de cerrar y escuchar Escape.
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    cerrarRef.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", alTeclear);
      anterior?.focus?.();
    };
  }, [onCerrar]);

  // Cada paso nuevo arranca desde arriba.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [paso]);

  // Reloj para la cuenta regresiva del pago.
  useEffect(() => {
    if (paso !== "pago") return;
    const id = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [paso]);

  // Si se termina el tiempo para pagar, la reserva vence sola.
  useEffect(() => {
    if (paso !== "pago" || !reservaActual) return;
    if (ahora >= reservaActual.venceA) vencer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ahora, paso, reservaActual]);

  const ocupadaPorReserva = (dep: DeporteId, d: number, h: string, c: string) =>
    reservas.some((r) => r.deporte === dep && r.dia === d && r.hora === h && r.cancha === c && r.estado !== "vencida");

  const canchasLibres = (h: string): Cancha[] =>
    deporte.canchas.filter((c) => !ocupadaDeBase(deporte.id, dia, h, c.id) && !ocupadaPorReserva(deporte.id, dia.indice, h, c.id));

  const horarioElegido = deporte.horarios.find((h) => h.hora === hora) ?? null;
  const libresElegido = hora ? canchasLibres(hora) : [];

  const elegirDeporte = (id: DeporteId) => {
    setDeporteId(id);
    setHora(null);
    setCanchaElegida("cualquiera");
  };

  const elegirDia = (i: number) => {
    setDiaIndice(i);
    setHora(null);
    setCanchaElegida("cualquiera");
  };

  const elegirHora = (h: string) => {
    setHora(h);
    setCanchaElegida("cualquiera");
  };

  const continuar = () => {
    if (!hora || libresElegido.length === 0) return;
    setPaso("datos");
  };

  const reservar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encontrados = validar(datos);
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) {
      document.getElementById(`hc-${primero}`)?.focus();
      return;
    }
    if (!hora) return;
    // Igual que el backend: si eligió cancha la usa; si no, la primera libre.
    const libres = canchasLibres(hora);
    const cancha = libres.find((c) => c.id === canchaElegida) ?? libres[0];
    if (!cancha) {
      setPaso("elegir");
      setHora(null);
      return;
    }
    const nueva: Reserva = {
      codigo: codigoNuevo(),
      deporte: deporte.id,
      dia: dia.indice,
      hora,
      cancha: cancha.id,
      estado: "pendiente_pago",
      venceA: Date.now() + COMPLEJO.minutosParaPagar * 60 * 1000,
    };
    setReservas((rs) => [...rs, nueva]);
    setActual(nueva.codigo);
    setAhora(Date.now());
    setPaso("pago");
  };

  const cambiarEstado = (estado: EstadoReserva) => {
    setReservas((rs) => rs.map((r) => (r.codigo === actual ? { ...r, estado } : r)));
  };

  const pagar = () => {
    setPaso("estado");
    setVerificando(true);
    window.setTimeout(() => {
      cambiarEstado("confirmada");
      setVerificando(false);
    }, 1800);
  };

  const vencer = () => {
    cambiarEstado("vencida");
    setVerificando(false);
    setPaso("estado");
  };

  const otraReserva = () => {
    setPaso("elegir");
    setHora(null);
    setCanchaElegida("cualquiera");
    setActual(null);
  };

  const irAContacto = () => {
    onCerrar();
    window.setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const canchaDeReserva = reservaActual
    ? DEPORTES.find((d) => d.id === reservaActual.deporte)?.canchas.find((c) => c.id === reservaActual.cancha)
    : undefined;

  const ruta =
    paso === "estado" && reservaActual ? `/${COMPLEJO.slug}/reserva/${reservaActual.codigo}` : `/${COMPLEJO.slug}`;

  return (
    <div className="hc-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div
        className="hc-ventana"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hc-titulo"
        data-producto="cancha"
      >
        <div className="hc-barra">
          <span className="hc-barra__demo mono">Demo</span>
          <span className="hc-barra__url">
            <LuLock size={13} aria-hidden="true" />
            <span className="mono">{ruta}</span>
          </span>
          <span className="hc-barra__aviso">Complejo inventado: no se reserva ni se cobra nada.</span>
          <button ref={cerrarRef} type="button" className="hc-barra__cerrar" onClick={onCerrar} aria-label="Cerrar la demo">
            <LuX size={20} />
          </button>
        </div>

        <div className="hc-scroll" ref={scrollRef}>
          <header className="hc-portada">
            <div className="hc-portada__cancha" aria-hidden="true">
              <i className="hc-area hc-area--izq" />
              <i className="hc-area hc-area--der" />
            </div>
          </header>

          <div className="hc-pagina">
            <div className="hc-negocio">
              <span className="hc-negocio__logo">{COMPLEJO.iniciales}</span>
              <div className="hc-negocio__texto">
                <h2 id="hc-titulo">{COMPLEJO.nombre}</h2>
                <p>
                  <LuMapPin size={14} aria-hidden="true" /> {DEPORTES.map((d) => d.nombre).join(" · ")}
                </p>
              </div>
              <ul className="hc-negocio__servicios">
                {COMPLEJO.servicios.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            {paso === "elegir" && (
              <div className="hc-grilla">
                <div className="hc-principal">
                  <section className="hc-bloque" aria-labelledby="hc-t-deporte">
                    <h3 id="hc-t-deporte">
                      <span className="hc-num">1</span> Elegí deporte
                    </h3>
                    <div className="hc-deportes">
                      {DEPORTES.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          className={`hc-deporte ${d.id === deporteId ? "is-on" : ""}`}
                          aria-pressed={d.id === deporteId}
                          onClick={() => elegirDeporte(d.id)}
                        >
                          <strong>{d.nombre}</strong>
                          <small>
                            {d.canchas.length} {d.canchas.length === 1 ? "cancha" : "canchas"} · {d.duracion} min
                          </small>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="hc-bloque" aria-labelledby="hc-t-dia">
                    <h3 id="hc-t-dia">
                      <span className="hc-num">2</span> Elegí el día
                    </h3>
                    <div className="hc-dias">
                      {dias.map((d) => (
                        <button
                          key={d.clave}
                          type="button"
                          className={`hc-dia ${d.indice === diaIndice ? "is-on" : ""}`}
                          aria-pressed={d.indice === diaIndice}
                          onClick={() => elegirDia(d.indice)}
                        >
                          <small>{d.corto}</small>
                          <strong className="mono">{d.numero}</strong>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="hc-bloque" aria-labelledby="hc-t-hora">
                    <h3 id="hc-t-hora">
                      <span className="hc-num">3</span> Elegí el horario
                    </h3>
                    <div className="hc-horarios">
                      {deporte.horarios.map((h) => {
                        const pasado = yaPaso(dia, h.hora);
                        const libres = pasado ? 0 : canchasLibres(h.hora).length;
                        const deshabilitado = pasado || libres === 0;
                        const on = h.hora === hora;
                        return (
                          <button
                            key={h.hora}
                            type="button"
                            disabled={deshabilitado}
                            className={`hc-horario ${on ? "is-on" : ""}`}
                            aria-pressed={on}
                            onClick={() => elegirHora(h.hora)}
                          >
                            <strong className="mono">{h.hora}</strong>
                            <span className="hc-horario__libres">
                              {pasado
                                ? "Ya pasó"
                                : libres === 0
                                  ? "Completo"
                                  : deporte.canchas.length === 1
                                    ? "Libre"
                                    : libres === 1
                                      ? "Queda 1 cancha"
                                      : `Quedan ${libres} canchas`}
                            </span>
                            <span className="mono hc-horario__precio">{pesos(h.precio)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {hora && libresElegido.length > 1 && (
                    <section className="hc-bloque hc-aparece" aria-labelledby="hc-t-cancha">
                      <h3 id="hc-t-cancha">
                        <span className="hc-num">4</span> ¿Alguna cancha en especial?
                      </h3>
                      <div className="hc-canchas">
                        <button
                          type="button"
                          className={`hc-cancha ${canchaElegida === "cualquiera" ? "is-on" : ""}`}
                          aria-pressed={canchaElegida === "cualquiera"}
                          onClick={() => setCanchaElegida("cualquiera")}
                        >
                          <strong>Cualquiera</strong>
                          <small>Te damos la primera libre</small>
                        </button>
                        {libresElegido.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className={`hc-cancha ${canchaElegida === c.id ? "is-on" : ""}`}
                            aria-pressed={canchaElegida === c.id}
                            onClick={() => setCanchaElegida(c.id)}
                          >
                            <strong>{c.nombre}</strong>
                            <small>{c.detalle}</small>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="hc-lateral hc-lateral--elegir">
                  <Resumen
                    deporteNombre={deporte.nombre}
                    diaLargo={dia.largo}
                    hora={hora}
                    duracion={deporte.duracion}
                    cancha={
                      canchaElegida === "cualquiera"
                        ? undefined
                        : deporte.canchas.find((c) => c.id === canchaElegida)
                    }
                    precio={horarioElegido?.precio}
                    sena={deporte.sena}
                  />
                  <button type="button" className="btn btn--accent hc-continuar" disabled={!hora} onClick={continuar}>
                    {hora ? "Continuar" : "Elegí un horario"}
                  </button>
                </aside>
              </div>
            )}

            {paso === "datos" && hora && horarioElegido && (
              <div className="hc-grilla">
                <form className="hc-principal hc-bloque" onSubmit={reservar} noValidate>
                  <button type="button" className="hc-volver" onClick={() => setPaso("elegir")}>
                    <LuArrowLeft size={16} aria-hidden="true" /> Cambiar horario
                  </button>
                  <h3>Tus datos</h3>
                  <p className="hc-ayuda">Los usamos solo para avisarte de tu reserva.</p>
                  {(
                    [
                      ["nombre", "Nombre y apellido", "name", "text"],
                      ["telefono", "Celular", "tel", "tel"],
                      ["email", "Email", "email", "email"],
                    ] as const
                  ).map(([campo, etiqueta, auto, tipo]) => (
                    <div key={campo} className={`hc-campo ${errores[campo] ? "is-error" : ""}`}>
                      <label htmlFor={`hc-${campo}`}>{etiqueta}</label>
                      <input
                        id={`hc-${campo}`}
                        type={tipo}
                        autoComplete={auto}
                        value={datos[campo]}
                        aria-invalid={errores[campo] ? true : undefined}
                        aria-describedby={errores[campo] ? `hc-${campo}-error` : undefined}
                        onChange={(e) => {
                          const valor = e.target.value;
                          setDatos((d) => ({ ...d, [campo]: valor }));
                          if (errores[campo]) setErrores((er) => ({ ...er, [campo]: undefined }));
                        }}
                      />
                      {errores[campo] && (
                        <p id={`hc-${campo}-error`} className="hc-error">
                          {errores[campo]}
                        </p>
                      )}
                    </div>
                  ))}
                  <button type="submit" className="btn btn--accent hc-pagar">
                    Pagar seña de {pesos(deporte.sena)} con Mercado Pago
                  </button>
                  <p className="hc-ayuda">
                    <LuClock size={14} aria-hidden="true" /> Te guardamos el horario {COMPLEJO.minutosParaPagar} minutos
                    para que pagues. Si cancelás con más de {COMPLEJO.horasCancelacion} horas, la seña vuelve sola.
                  </p>
                </form>

                <aside className="hc-lateral">
                  <Resumen
                    deporteNombre={deporte.nombre}
                    diaLargo={dia.largo}
                    hora={hora}
                    duracion={deporte.duracion}
                    cancha={
                      canchaElegida === "cualquiera"
                        ? undefined
                        : deporte.canchas.find((c) => c.id === canchaElegida)
                    }
                    precio={horarioElegido.precio}
                    sena={deporte.sena}
                  />
                </aside>
              </div>
            )}

            {paso === "pago" && reservaActual && (
              <div className="hc-centro hc-aparece">
                <div className="hc-simulador">
                  <p className="hc-simulador__etiqueta mono">Simulación del pago</p>
                  <h3>Acá se abre Mercado Pago</h3>
                  <p>
                    En la página real, tu cliente paga la seña de <b>{pesos(deporte.sena)}</b> en Mercado Pago y vuelve
                    solo. En esta demo no se cobra nada: elegí qué pasa.
                  </p>
                  <div className="hc-reloj" aria-live="off">
                    <LuClock size={18} aria-hidden="true" />
                    <span>
                      El horario queda guardado por <b className="mono">{mmss(reservaActual.venceA - ahora)}</b>
                    </span>
                  </div>
                  <div className="hc-simulador__acciones">
                    <button type="button" className="btn btn--accent" onClick={pagar}>
                      Simular pago aprobado
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={vencer}>
                      Simular que no pagó
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paso === "estado" && reservaActual && (
              <div className="hc-centro hc-aparece" aria-live="polite">
                {verificando ? (
                  <div className="hc-estado">
                    <span className="hc-estado__icono hc-estado__icono--espera">
                      <LuLoaderCircle size={30} className="girando" aria-hidden="true" />
                    </span>
                    <h3>Esperando la confirmación del pago</h3>
                    <p>Mercado Pago nos avisa apenas se aprueba. No hace falta que mandes comprobante.</p>
                  </div>
                ) : reservaActual.estado === "confirmada" ? (
                  <div className="hc-estado">
                    <span className="hc-estado__icono">
                      <LuCheck size={34} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <h3>¡Turno confirmado!</h3>
                    <dl className="hc-ticket">
                      <div>
                        <dt>Deporte</dt>
                        <dd>{DEPORTES.find((d) => d.id === reservaActual.deporte)?.nombre}</dd>
                      </div>
                      <div>
                        <dt>Cancha</dt>
                        <dd>
                          {canchaDeReserva?.nombre} · {canchaDeReserva?.detalle}
                        </dd>
                      </div>
                      <div>
                        <dt>Cuándo</dt>
                        <dd>
                          {dias[reservaActual.dia].largo} · {reservaActual.hora} a{" "}
                          {horaFin(reservaActual.hora, DEPORTES.find((d) => d.id === reservaActual.deporte)!.duracion)}
                        </dd>
                      </div>
                      <div>
                        <dt>Seña pagada</dt>
                        <dd className="mono">{pesos(DEPORTES.find((d) => d.id === reservaActual.deporte)!.sena)}</dd>
                      </div>
                    </dl>
                    <p className="hc-ayuda">
                      <LuMail size={14} aria-hidden="true" /> Le llega la confirmación por email y el turno aparece en
                      la agenda del dueño.
                    </p>
                    <div className="hc-estado__acciones">
                      <button type="button" className="btn btn--ghost" onClick={otraReserva}>
                        Hacer otra reserva
                      </button>
                      <button type="button" className="btn btn--accent" onClick={irAContacto}>
                        Quiero esto en mi complejo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="hc-estado">
                    <span className="hc-estado__icono hc-estado__icono--vencida">
                      <LuTimerOff size={30} aria-hidden="true" />
                    </span>
                    <h3>El horario se liberó</h3>
                    <p>
                      Pasaron los {COMPLEJO.minutosParaPagar} minutos sin pago, así que el turno quedó libre para otro.
                      Nadie tuvo que hacer nada.
                    </p>
                    <div className="hc-estado__acciones">
                      <button type="button" className="btn btn--accent" onClick={otraReserva}>
                        Volver a elegir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <footer className="hc-pie">
              <span>
                <IconoPelota size={14} /> Reservas con <b>Hay Cancha</b>
              </span>
              <span>
                <LuShieldCheck size={14} aria-hidden="true" /> El turno se confirma solo con el pago aprobado
              </span>
              {HAY_CANCHA.url && (
                <a className="hc-pie__web" href={HAY_CANCHA.url} target="_blank" rel="noopener noreferrer">
                  Ver la web real de Hay Cancha <LuArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </footer>
          </div>
        </div>

        {paso === "elegir" && (
          <div className="hc-barra-movil">
            <span>
              {hora && horarioElegido ? (
                <>
                  <b>
                    {deporte.nombre} · {dia.corto} {hora}
                  </b>
                  <small>
                    Seña <span className="mono">{pesos(deporte.sena)}</span>
                  </small>
                </>
              ) : (
                <small>Elegí un horario para seguir</small>
              )}
            </span>
            <button type="button" className="btn btn--accent" disabled={!hora} onClick={continuar}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ResumenProps {
  deporteNombre: string;
  diaLargo: string;
  hora: string | null;
  duracion: number;
  cancha?: Cancha;
  precio?: number;
  sena: number;
}

function Resumen({ deporteNombre, diaLargo, hora, duracion, cancha, precio, sena }: ResumenProps) {
  return (
    <div className="hc-resumen">
      <p className="hc-resumen__titulo mono">Tu reserva</p>
      <dl>
        <div>
          <dt>Deporte</dt>
          <dd>{deporteNombre}</dd>
        </div>
        <div>
          <dt>Día</dt>
          <dd>{diaLargo}</dd>
        </div>
        <div>
          <dt>Horario</dt>
          <dd>{hora ? `${hora} a ${horaFin(hora, duracion)}` : "—"}</dd>
        </div>
        <div>
          <dt>Cancha</dt>
          <dd>{cancha ? `${cancha.nombre} · ${cancha.detalle}` : "La primera libre"}</dd>
        </div>
      </dl>
      {precio !== undefined && (
        <dl className="hc-resumen__plata">
          <div>
            <dt>Turno</dt>
            <dd className="mono">{pesos(precio)}</dd>
          </div>
          <div className="hc-resumen__sena">
            <dt>Seña para reservar</dt>
            <dd className="mono">{pesos(sena)}</dd>
          </div>
          <div>
            <dt>Pagás en la cancha</dt>
            <dd className="mono">{pesos(precio - sena)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
