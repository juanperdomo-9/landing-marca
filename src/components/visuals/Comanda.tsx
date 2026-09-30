import { LuBadgeCheck, LuUsers } from "react-icons/lu";
import { pesos } from "../../lib/formato";
import "./visuals.css";

const ITEMS = [
  { cant: 1, nombre: "Milanesa napolitana", precio: 15900 },
  { cant: 1, nombre: "Empanadas carne x6", precio: 13200 },
  { cant: 2, nombre: "Flan casero", precio: 5400 },
];

export function Comanda() {
  const total = ITEMS.reduce((s, i) => s + i.cant * i.precio, 0);

  return (
    <div className="resto" data-producto="resto">
      <div className="comanda">
        <div className="comanda__ranura" aria-hidden="true" />
        <div className="comanda__papel">
          <p className="comanda__negocio mono">LA ESQUINA · ROTISERÍA</p>
          <div className="comanda__meta mono">
            <span>Pedido #128</span>
            <span>Para retirar</span>
            <span>Hoy 21:30</span>
            <span className="comanda__pagado">
              <LuBadgeCheck size={13} aria-hidden="true" /> PAGADO
            </span>
          </div>
          <ul className="comanda__items mono">
            {ITEMS.map((i) => (
              <li key={i.nombre}>
                <span>{i.cant}</span>
                <span>{i.nombre}</span>
                <span>{pesos(i.cant * i.precio)}</span>
              </li>
            ))}
          </ul>
          <p className="comanda__total mono">
            <span>TOTAL</span>
            <span>{pesos(total)}</span>
          </p>
          <p className="comanda__pie mono">Pagado con Mercado Pago</p>
        </div>
      </div>

      <div className="mesa">
        <span className="mesa__icono">
          <LuUsers size={18} aria-hidden="true" />
        </span>
        <span className="mesa__texto">
          <strong>Mesa para 4</strong>
          <small className="mono">Sábado 21:30</small>
        </span>
        <span className="mesa__estado">Confirmada</span>
      </div>
    </div>
  );
}
