import { LuCheck, LuPlus, LuShoppingBag } from "react-icons/lu";
import { pesos } from "../../lib/formato";
import "./demos.css";

const PLATOS = [
  { id: "mila", nombre: "Milanesa napolitana con papas", corto: "Milanesa napolitana", precio: 15900, paso: 1 },
  { id: "empa", nombre: "Empanadas de carne cortada a cuchillo x6", corto: "Empanadas x6", precio: 13200, paso: 2 },
  { id: "flan", nombre: "Flan casero con dulce de leche", corto: "Flan casero", precio: 5400, paso: 3 },
  { id: "sorr", nombre: "Sorrentinos de jamón y queso", corto: "Sorrentinos", precio: 14800, paso: 99 },
];
const CATEGORIAS = ["Platos", "Empanadas", "Postres", "Bebidas"];

/**
 * Pasos: 0 carta · 1-3 suma productos · 4 resumen del pedido · 5 confirmado
 */
export function DemoRestaurante({ paso }: { paso: number }) {
  const elegidos = PLATOS.filter((p) => paso >= p.paso);
  const total = elegidos.reduce((s, p) => s + p.precio, 0);

  return (
    <div className="demo" data-producto="resto">
      <header className="demo__negocio">
        <span className="demo__avatar">LE</span>
        <span>
          <strong>La Esquina</strong>
          <small>Rotisería · Pedidos para retirar</small>
        </span>
      </header>

      <div className="demo__chips">
        {CATEGORIAS.map((c, i) => (
          <span key={c} className={`demo__chip ${i === 0 ? "is-on" : ""}`}>
            {c}
          </span>
        ))}
      </div>

      <ul className="demo__carta">
        {PLATOS.map((p) => {
          const sumado = paso >= p.paso;
          return (
            <li key={p.id} className={sumado ? "is-sumado" : ""}>
              <span className="demo__foto" aria-hidden="true" />
              <span className="demo__plato">
                <span>{p.nombre}</span>
                <span className="mono">{pesos(p.precio)}</span>
              </span>
              <span className="demo__mas">{sumado ? <LuCheck size={15} strokeWidth={3} /> : <LuPlus size={15} />}</span>
            </li>
          );
        })}
      </ul>

      <div className={`demo__carrito ${elegidos.length > 0 && paso < 4 ? "is-visible" : ""}`}>
        <span key={elegidos.length} className="demo__carrito-cant">
          <LuShoppingBag size={15} /> {elegidos.length}
        </span>
        <span>Ver pedido</span>
        <span className="mono">{pesos(total)}</span>
      </div>

      <div className={`demo__sheet ${paso === 4 ? "is-abierto" : ""}`}>
        <span className="demo__agarre" />
        <strong className="demo__sheet-titulo">Tu pedido</strong>
        <small className="demo__sheet-sub">Retirás hoy a las 21:15</small>
        <dl className="demo__cuenta">
          {PLATOS.slice(0, 3).map((p) => (
            <div key={p.id}>
              <dt>{p.corto}</dt>
              <dd className="mono">{pesos(p.precio)}</dd>
            </div>
          ))}
          <div className="demo__total">
            <dt>Total</dt>
            <dd className="mono">{pesos(total)}</dd>
          </div>
        </dl>
        <span className="demo__pagar">Pagar con Mercado Pago</span>
      </div>

      <div className={`demo__exito ${paso >= 5 ? "is-visible" : ""}`}>
        <span className="demo__check">
          <LuCheck size={30} strokeWidth={3} />
        </span>
        <strong>¡Pedido confirmado!</strong>
        <span className="demo__exito-det">
          Pedido #127
          <br />
          Retirás a las 21:15
        </span>
        <span className="demo__recibo">
          <span>Pagado</span>
          <span className="mono">{pesos(total)}</span>
        </span>
        <small className="demo__mail">Te avisamos cuando esté listo</small>
      </div>
    </div>
  );
}
