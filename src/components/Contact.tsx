import { useRef, useState, type FormEvent } from "react";
import { LuArrowRight, LuAtSign, LuCheck, LuCopy, LuGift, LuLoaderCircle, LuMail, LuRotateCcw } from "react-icons/lu";
import { MARCA, OFERTA } from "../config";
import { enviarContacto, FORMULARIO_CONECTADO, type DatosContacto, type Rubro } from "../lib/contacto";
import { retraso } from "../hooks/useReveal";
import "./Contact.css";

const RUBROS: { id: Rubro; texto: string }[] = [
  { id: "cancha", texto: "Cancha o complejo" },
  { id: "pelu", texto: "Peluquería o barbería" },
  { id: "resto", texto: "Restaurante o rotisería" },
  { id: "otro", texto: "Otro rubro" },
];

type Errores = Partial<Record<keyof DatosContacto, string>>;

const VACIO: DatosContacto = { nombre: "", negocio: "", rubro: "cancha", contacto: "", mensaje: "" };

function validar(d: DatosContacto): Errores {
  const e: Errores = {};
  if (d.nombre.trim().length < 2) e.nombre = "Decinos cómo te llamás.";
  if (d.negocio.trim().length < 2) e.negocio = "¿Cómo se llama tu negocio?";
  const c = d.contacto.trim();
  const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
  const esTelefono = c.replace(/\D/g, "").length >= 8;
  if (!esEmail && !esTelefono) e.contacto = "Dejanos un celular o un email válido.";
  return e;
}

function Copiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      // Si el navegador no deja copiar, dejamos el texto seleccionado.
      const el = ref.current;
      if (!el) return;
      const rango = document.createRange();
      rango.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(rango);
    }
  };

  return (
    <span className="copiar">
      <span ref={ref} className="copiar__texto">
        {texto}
      </span>
      <button type="button" onClick={copiar} aria-label={`Copiar ${etiqueta}`}>
        {copiado ? <LuCheck size={15} /> : <LuCopy size={15} />}
        <span>{copiado ? "Copiado" : "Copiar"}</span>
      </button>
    </span>
  );
}

export function Contact() {
  const [datos, setDatos] = useState<DatosContacto>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"editando" | "enviando" | "listo" | "error">("editando");

  const cambiar = <K extends keyof DatosContacto>(campo: K, valor: DatosContacto[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encontrados = validar(datos);
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) {
      document.getElementById(`contacto-${primero}`)?.focus();
      return;
    }
    setEstado("enviando");
    try {
      await enviarContacto(datos);
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  };

  const nuevo = () => {
    setDatos(VACIO);
    setErrores({});
    setEstado("editando");
  };

  return (
    <section id="contacto" className="section contacto">
      <div className="container contacto__inner">
        <div className="contacto__copy" data-reveal="left">
          <p className="eyebrow">
            <b>07</b> Hablemos
          </p>
          <h2>Mostranos tu negocio y te armamos una demo con tus datos</h2>
          <p className="contacto__lead">
            Te mostramos cómo quedaría tu página con tus canchas o servicios, tus horarios y tus precios. Sin
            compromiso: {OFERTA.titulo.charAt(0).toLowerCase() + OFERTA.titulo.slice(1)}.
          </p>
          <div className="contacto__canales">
            <div className="contacto__canal">
              <span className="contacto__canal-icono">
                <LuMail size={18} aria-hidden="true" />
              </span>
              <span className="contacto__canal-cuerpo">
                <small>Email</small>
                <Copiar texto={MARCA.email} etiqueta="el email" />
              </span>
            </div>
            <div className="contacto__canal">
              <span className="contacto__canal-icono">
                <LuAtSign size={18} aria-hidden="true" />
              </span>
              <span className="contacto__canal-cuerpo">
                <small>Instagram</small>
                <Copiar texto={MARCA.instagram} etiqueta="el usuario de Instagram" />
              </span>
            </div>
          </div>
        </div>

        <div className="contacto__form-caja" data-reveal="tilt-right" style={retraso(150)}>
          <p className="oferta oferta--caja">
            <span className="oferta__icono" aria-hidden="true">
              <LuGift size={16} />
            </span>
            <span>
              <b>{OFERTA.titulo}.</b> {OFERTA.detalle}
            </span>
          </p>
          {estado === "listo" ? (
            <div className="contacto__listo" role="status">
              <span className="contacto__listo-check">
                <LuCheck size={30} strokeWidth={3} />
              </span>
              <h3>¡Gracias, {datos.nombre.trim().split(" ")[0]}!</h3>
              <p>
                Te vamos a escribir para coordinar la demo de <b>{datos.negocio.trim()}</b>.
              </p>
              {!FORMULARIO_CONECTADO && (
                <p className="contacto__nota">Vista previa: este formulario todavía no envía los datos a ningún lado.</p>
              )}
              <button type="button" className="btn btn--ghost" onClick={nuevo}>
                <LuRotateCcw aria-hidden="true" /> Cargar otra consulta
              </button>
            </div>
          ) : (
            <form className="contacto__form" onSubmit={enviar} noValidate>
              <div className="campo-doble">
                <Campo
                  id="nombre"
                  etiqueta="Tu nombre"
                  valor={datos.nombre}
                  error={errores.nombre}
                  autoComplete="name"
                  onChange={(v) => cambiar("nombre", v)}
                />
                <Campo
                  id="negocio"
                  etiqueta="Nombre del negocio"
                  valor={datos.negocio}
                  error={errores.negocio}
                  autoComplete="organization"
                  onChange={(v) => cambiar("negocio", v)}
                />
              </div>

              <fieldset className="campo">
                <legend>Rubro</legend>
                <div className="rubros">
                  {RUBROS.map((r) => (
                    <label key={r.id} className={`rubro ${datos.rubro === r.id ? "is-on" : ""}`}>
                      <input
                        type="radio"
                        name="rubro"
                        value={r.id}
                        checked={datos.rubro === r.id}
                        onChange={() => cambiar("rubro", r.id)}
                      />
                      {r.texto}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Campo
                id="contacto"
                etiqueta="Celular o email"
                valor={datos.contacto}
                error={errores.contacto}
                autoComplete="email"
                onChange={(v) => cambiar("contacto", v)}
              />

              <div className="campo">
                <label htmlFor="contacto-mensaje">
                  ¿Algo más que quieras contarnos? <span className="campo__opcional">Opcional</span>
                </label>
                <textarea
                  id="contacto-mensaje"
                  rows={3}
                  value={datos.mensaje}
                  maxLength={600}
                  placeholder="Por ejemplo: tenemos 4 canchas de fútbol 7 y una de pádel."
                  onChange={(e) => cambiar("mensaje", e.target.value)}
                />
              </div>

              {estado === "error" && (
                <p className="campo__error" role="alert">
                  No pudimos enviarlo. Probá de nuevo en un rato.
                </p>
              )}

              <button type="submit" className="btn btn--accent contacto__enviar" disabled={estado === "enviando"}>
                {estado === "enviando" ? (
                  <>
                    <LuLoaderCircle className="girando" aria-hidden="true" /> Enviando…
                  </>
                ) : (
                  <>
                    Quiero mi demo <LuArrowRight aria-hidden="true" />
                  </>
                )}
              </button>
              {!FORMULARIO_CONECTADO && (
                <p className="contacto__nota">Vista previa: el formulario todavía no está conectado.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

interface CampoProps {
  id: string;
  etiqueta: string;
  valor: string;
  error?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
}

function Campo({ id, etiqueta, valor, error, autoComplete, onChange }: CampoProps) {
  const idInput = `contacto-${id}`;
  const idError = `${idInput}-error`;
  return (
    <div className={`campo ${error ? "is-error" : ""}`}>
      <label htmlFor={idInput}>{etiqueta}</label>
      <input
        id={idInput}
        value={valor}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={idError} className="campo__error">
          {error}
        </p>
      )}
    </div>
  );
}
