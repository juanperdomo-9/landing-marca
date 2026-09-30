import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MARCA, whatsappLink } from "../config";
import "./WhatsappFlotante.css";

const MENSAJE = `Hola! Vi la web de ${MARCA.nombre} y quiero saber más.`;

/**
 * Botón de WhatsApp fijo abajo a la derecha. Aparece recién después de la portada
 * y se esconde en la sección de contacto, donde ya está el formulario y el WhatsApp.
 */
export function WhatsappFlotante() {
  const [pasoPortada, setPasoPortada] = useState(false);
  const [enContacto, setEnContacto] = useState(false);
  const visible = pasoPortada && !enContacto;

  useEffect(() => {
    const medir = () => setPasoPortada(window.scrollY > window.innerHeight * 0.8);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  useEffect(() => {
    const contacto = document.getElementById("contacto");
    if (!contacto || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setEnContacto(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(contacto);
    return () => io.disconnect();
  }, []);

  return (
    <a
      className={`wsp ${visible ? "is-visible" : ""}`}
      href={whatsappLink(MARCA.whatsapp, MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      tabIndex={visible ? undefined : -1}
    >
      <FaWhatsapp size={28} aria-hidden="true" />
      <span className="wsp__texto">¿Dudas? Escribinos</span>
    </a>
  );
}
