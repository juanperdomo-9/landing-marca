import { useEffect, useState } from "react";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";
import { Logo } from "./Logo";
import { BotonHayCancha } from "./hay-cancha/contexto";
import "./Header.css";

const LINKS = [
  { href: "#productos", texto: "Productos" },
  { href: "#como-funciona", texto: "Cómo funciona" },
  { href: "#asistente", texto: "Asistente" },
  { href: "#calculadora", texto: "Calculadora" },
  { href: "#preguntas", texto: "Preguntas" },
];

export function Header() {
  const [conScroll, setConScroll] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const medir = () => setConScroll(window.scrollY > 8);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <header className={`header ${conScroll || abierto ? "header--solido" : ""}`} data-reveal="down">
      <div className="container header__inner">
        <a href="#top" className="header__marca" aria-label="Ir al inicio" onClick={cerrar}>
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Secciones">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.texto}
            </a>
          ))}
        </nav>

        <div className="header__acciones">
          <BotonHayCancha modo="web" className="btn btn--ghost header__probar" />
          <a className="btn btn--accent header__cta" href="#contacto">
            Pedí una demo <LuArrowRight aria-hidden="true" />
          </a>
          <button
            type="button"
            className="header__toggle"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((a) => !a)}
          >
            {abierto ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>

      <div id="menu-movil" className={`header__movil ${abierto ? "is-abierto" : ""}`} hidden={!abierto}>
        <nav className="container" aria-label="Secciones">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={cerrar} style={{ animationDelay: `${i * 40}ms` }}>
              <span className="mono">0{i + 1}</span>
              {l.texto}
            </a>
          ))}
          <BotonHayCancha modo="web" className="btn btn--ghost" onClick={cerrar} />
          <a className="btn btn--accent" href="#contacto" onClick={cerrar}>
            Pedí una demo <LuArrowRight aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
