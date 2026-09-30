import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuLandmark,
  LuPalette,
  LuPhone,
  LuSmartphone,
  LuUser,
  LuUsers,
  LuWallet,
} from "react-icons/lu";
import { retraso } from "../hooks/useReveal";
import "./WhyUs.css";

interface TarjetaProps {
  className?: string;
  /** Desde dónde aparece (ver styles/reveal.css). */
  aparece?: string;
  demora?: number;
  children: ReactNode;
}

function Tarjeta({ className = "", aparece = "up", demora = 0, children }: TarjetaProps) {
  const ref = useRef<HTMLElement>(null);
  const mover = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <article
      ref={ref}
      className={`bento__card ${className}`}
      onPointerMove={mover}
      data-reveal={aparece}
      style={retraso(demora)}
    >
      {children}
    </article>
  );
}

export function WhyUs() {
  return (
    <section id="por-que" className="section porque">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="left">
            <b>05</b> Por qué nosotros
          </p>
          <h2 data-reveal="up" style={retraso(80)}>
            Pensado para cómo trabaja un negocio de acá
          </h2>
          <p data-reveal="up" style={retraso(160)}>Mercado Pago, el celular en la mano y clientes que escriben a cualquier hora. Lo armamos para eso.</p>
        </div>

        <div className="bento">
          <Tarjeta className="bento__card--ancha" aparece="left">
            <span className="bento__icono">
              <LuWallet size={20} aria-hidden="true" />
            </span>
            <h3>La plata va directo a tu cuenta</h3>
            <p>Cada negocio cobra en su propio Mercado Pago. No intermediamos ni retenemos nada.</p>
            <div className="dinero" aria-hidden="true">
              <span className="dinero__nodo">
                <LuUser size={18} />
                Tu cliente
              </span>
              <span className="dinero__via">
                <i />
              </span>
              <span className="dinero__nodo dinero__nodo--mp">Mercado Pago</span>
              <span className="dinero__via">
                <i />
              </span>
              <span className="dinero__nodo dinero__nodo--vos">
                <LuLandmark size={18} />
                Tu cuenta
              </span>
            </div>
          </Tarjeta>

          <Tarjeta aparece="right" demora={120}>
            <span className="bento__icono">
              <LuBadgeCheck size={20} aria-hidden="true" />
            </span>
            <h3>Chau comprobantes truchos</h3>
            <p>Nadie revisa capturas: el turno se confirma cuando Mercado Pago aprueba el pago.</p>
          </Tarjeta>

          <Tarjeta aparece="up">
            <span className="bento__icono">
              <LuSmartphone size={20} aria-hidden="true" />
            </span>
            <h3>Todo desde el celular</h3>
            <p>La agenda está pensada para mirarla en la cancha o entre cliente y cliente, con una mano.</p>
          </Tarjeta>

          <Tarjeta aparece="zoom" demora={120}>
            <span className="bento__icono">
              <LuPalette size={20} aria-hidden="true" />
            </span>
            <h3>Tu marca, no la nuestra</h3>
            <p>Tu página lleva tu logo, tu portada y tus colores.</p>
            <div className="marcas" aria-hidden="true">
              <span data-producto="cancha">
                <i />
                El Potrero
              </span>
              <span data-producto="pelu">
                <i />
                Barbería Norte
              </span>
              <span data-producto="resto">
                <i />
                La Esquina
              </span>
            </div>
          </Tarjeta>

          <Tarjeta aparece="up" demora={240}>
            <span className="bento__icono">
              <LuPhone size={20} aria-hidden="true" />
            </span>
            <h3>Las reservas por teléfono también</h3>
            <p>Cargás la reserva en segundos y la página deja de ofrecer ese horario. Nunca se pisan.</p>
          </Tarjeta>

          <Tarjeta className="bento__card--banner" aparece="zoom">
            <span className="bento__icono">
              <LuUsers size={20} aria-hidden="true" />
            </span>
            <div className="bento__banner-texto">
              <h3>Del otro lado hay personas</h3>
              <p>
                El alta, la carga de datos y el soporte los hacemos nosotros. La automatización es para tus clientes,
                no para vos.
              </p>
            </div>
            <a className="btn btn--ghost" href="#contacto">
              Hablar con el equipo <LuArrowRight aria-hidden="true" />
            </a>
          </Tarjeta>
        </div>
      </div>
    </section>
  );
}
