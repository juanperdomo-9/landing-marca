import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Marquee.css";

const RUBROS = [
  { texto: "Fútbol 5", producto: "cancha" },
  { texto: "Fútbol 7", producto: "cancha" },
  { texto: "Fútbol 11", producto: "cancha" },
  { texto: "Pádel", producto: "cancha" },
  { texto: "Tenis", producto: "cancha" },
  { texto: "Básquet", producto: "cancha" },
  { texto: "Vóley", producto: "cancha" },
  { texto: "Peluquerías", producto: "pelu" },
  { texto: "Barberías", producto: "pelu" },
  { texto: "Restaurantes", producto: "resto" },
  { texto: "Rotiserías", producto: "resto" },
];

export function Marquee() {
  const reduce = useReducedMotion();
  const copias = reduce ? 1 : 2;

  return (
    <section className="marquee" aria-label="Para quién es">
      <div className="container marquee__head">
        <p className="eyebrow">Para negocios que viven de los turnos</p>
      </div>
      <div className={`marquee__track ${reduce ? "marquee__track--quieta" : ""}`}>
        {Array.from({ length: copias }, (_, c) => (
          <ul key={c} className="marquee__lista" aria-hidden={c > 0 ? true : undefined}>
            {RUBROS.map((r) => (
              <li key={r.texto} data-producto={r.producto}>
                <span className="marquee__dot" aria-hidden="true" />
                {r.texto}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
