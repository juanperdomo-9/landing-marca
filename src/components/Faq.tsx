import { useId, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { OFERTA } from "../config";
import "./Faq.css";

const PREGUNTAS = [
  {
    p: "¿Mis clientes tienen que bajarse una app?",
    r: "No. Entran a tu link desde el navegador del celular y reservan en un minuto. Nada para instalar, ni para vos ni para ellos.",
  },
  {
    p: "¿La plata de las señas pasa por ustedes?",
    r: "No. Vinculás tu cuenta de Mercado Pago y cada seña se acredita directo ahí. Nosotros nunca tocamos tu plata.",
  },
  {
    p: "¿Qué pasa si alguien reserva y no paga?",
    r: "El horario queda apartado unos minutos (10, salvo que elijas otro número). Si no paga en ese tiempo, se libera solo y lo puede tomar otro.",
  },
  {
    p: "¿Y si un cliente cancela?",
    r: "Vos definís con cuántas horas de anticipación se devuelve la seña. Si cancela antes, la seña vuelve sola a su Mercado Pago. Si cancela sobre la hora, la seña queda para vos.",
  },
  {
    p: "¿Puedo seguir tomando reservas por teléfono?",
    r: "Sí. Las cargás en tu agenda en segundos y la página deja de ofrecer ese horario, así nunca se pisa una reserva telefónica con una online. También podés bloquear horarios por torneo, lluvia o mantenimiento.",
  },
  {
    p: "¿Qué pasa si el asistente no sabe algo?",
    r: "No inventa. Le avisa al cliente que no tiene ese dato y te deja la pregunta en el panel para que la completes. La próxima vez ya sabe qué responder.",
  },
  {
    p: "¿Cuánto cuesta?",
    r: `${OFERTA.titulo}, así lo probás con tus clientes antes de pagar. Después es un abono mensual fijo: escribinos, te mostramos una demo con los datos de tu negocio y te pasamos el precio.`,
  },
];

export function Faq() {
  const [abierta, setAbierta] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="preguntas" className="section faq">
      <div className="container faq__inner">
        <div className="faq__head">
          <p className="eyebrow">
            <b>06</b> Preguntas
          </p>
          <h2>Lo que siempre nos preguntan</h2>
          <p>
            ¿Te quedó otra duda? <a href="#contacto">Escribinos</a> y te respondemos nosotros, no un bot.
          </p>
        </div>

        <div className="faq__lista">
          {PREGUNTAS.map((item, i) => {
            const on = abierta === i;
            const idBoton = `${base}-b${i}`;
            const idPanel = `${base}-p${i}`;
            return (
              <div key={item.p} className={`faq__item ${on ? "is-abierta" : ""}`}>
                <h3>
                  <button
                    id={idBoton}
                    type="button"
                    aria-expanded={on}
                    aria-controls={idPanel}
                    onClick={() => setAbierta(on ? null : i)}
                  >
                    <span>{item.p}</span>
                    <span className="faq__signo" aria-hidden="true">
                      <LuPlus size={18} />
                    </span>
                  </button>
                </h3>
                <div id={idPanel} role="region" aria-labelledby={idBoton} className="faq__panel">
                  <div>
                    <p>{item.r}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
