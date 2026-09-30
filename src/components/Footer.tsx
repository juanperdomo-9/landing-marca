import { ETIQUETA_ESTADO, MARCA, PRODUCTOS } from "../config";
import { Logo } from "./Logo";
import { BotonHayCancha } from "./hay-cancha/contexto";
import { retraso } from "../hooks/useReveal";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__marca" data-reveal="up">
            <Logo />
            <p>{MARCA.bajada}. Reservas, cobros y atención automática para que vos te ocupes de tu negocio.</p>
          </div>

          <nav className="footer__col" aria-label="Productos" data-reveal="up" style={retraso(100)}>
            <p className="footer__titulo">Productos</p>
            <ul>
              {PRODUCTOS.map((p) => (
                <li key={p.id}>
                  {p.id === "cancha" ? (
                    <BotonHayCancha
                      modo="web"
                      className="footer__boton"
                      textoDemo={p.nombre}
                      textoWeb={p.nombre}
                      conIcono={false}
                    />
                  ) : (
                    <a href="#productos">{p.nombre}</a>
                  )}
                  <span className={`footer__estado ${p.estado === "lanzamiento" ? "is-live" : ""}`}>
                    {ETIQUETA_ESTADO[p.estado]}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="La marca" data-reveal="up" style={retraso(200)}>
            <p className="footer__titulo">La marca</p>
            <ul>
              <li>
                <a href="#como-funciona">Cómo funciona</a>
              </li>
              <li>
                <a href="#asistente">Asistente con IA</a>
              </li>
              <li>
                <a href="#calculadora">Calculadora</a>
              </li>
              <li>
                <a href="#preguntas">Preguntas</a>
              </li>
            </ul>
          </nav>

          <div className="footer__col" data-reveal="up" style={retraso(300)}>
            <p className="footer__titulo">Contacto</p>
            <ul>
              <li className="footer__dato">{MARCA.email}</li>
              <li className="footer__dato">{MARCA.instagram}</li>
              <li>
                <a href="#contacto">Pedí una demo</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__gigante" aria-hidden="true" data-reveal="rise">
          {MARCA.nombre}
        </p>

        <div className="footer__base">
          <span>
            © {MARCA.anio} {MARCA.nombre}. Hecho en Argentina.
          </span>
          <a href="#top">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  );
}
