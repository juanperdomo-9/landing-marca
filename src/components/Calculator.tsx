import { useId, useState, type CSSProperties } from "react";
import { LuArrowRight } from "react-icons/lu";
import { OFERTA } from "../config";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { retraso } from "../hooks/useReveal";
import { pesos } from "../lib/formato";
import "./Calculator.css";

const SEMANAS_POR_MES = 52 / 12;

interface SliderProps {
  etiqueta: string;
  ayuda: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  mostrar: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ etiqueta, ayuda, valor, min, max, paso, mostrar, onChange }: SliderProps) {
  const id = useId();
  const porcentaje = ((valor - min) / (max - min)) * 100;
  return (
    <div className="calc__control">
      <div className="calc__control-cabecera">
        <label htmlFor={id}>{etiqueta}</label>
        <output htmlFor={id} className="mono">
          {mostrar(valor)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--lleno": `${porcentaje}%` } as CSSProperties}
      />
      <div className="calc__extremos mono" aria-hidden="true">
        <span>{mostrar(min)}</span>
        <span>{mostrar(max)}</span>
      </div>
      <p className="calc__ayuda">{ayuda}</p>
    </div>
  );
}

export function Calculator() {
  const [precio, setPrecio] = useState(60000);
  const [porSemana, setPorSemana] = useState(4);

  const turnosMes = Math.round(porSemana * SEMANAS_POR_MES);
  const perdidaMes = porSemana * SEMANAS_POR_MES * precio;
  const perdidaAnio = porSemana * 52 * precio;

  const mesAnimado = useAnimatedNumber(perdidaMes);
  const anioAnimado = useAnimatedNumber(perdidaAnio);

  return (
    <section id="calculadora" className="section calc">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="left">
            <b>04</b> Hacé la cuenta
          </p>
          <h2 data-reveal="up" style={retraso(80)}>
            ¿Cuánta plata se te va en turnos vacíos?
          </h2>
          <p data-reveal="up" style={retraso(160)}>
            Cancelaciones de último momento, gente que no viene, horarios que nadie reservó porque no viste el mensaje
            a tiempo. Poné tus números.
          </p>
        </div>

        <div className="calc__tarjeta" data-reveal="up">
          <div className="calc__controles" data-reveal="left" style={retraso(200)}>
            <Slider
              etiqueta="Precio del turno"
              ayuda="Lo que cobrás por un turno o servicio."
              valor={precio}
              min={10000}
              max={150000}
              paso={5000}
              mostrar={pesos}
              onChange={setPrecio}
            />
            <Slider
              etiqueta="Turnos que se pierden por semana"
              ayuda="Contá los que se caen, los que no vienen y los que quedan vacíos."
              valor={porSemana}
              min={1}
              max={30}
              paso={1}
              mostrar={(v) => `${v}`}
              onChange={setPorSemana}
            />
          </div>

          <div className="calc__resultado" aria-live="polite" data-reveal="right" style={retraso(320)}>
            <p className="calc__rotulo">Por mes se te van, más o menos</p>
            <p className="calc__monto mono">{pesos(Math.round(mesAnimado / 100) * 100)}</p>
            <p className="calc__anio">
              En un año: <b className="mono">{pesos(Math.round(anioAnimado / 1000) * 1000)}</b>
            </p>

            <div className="calc__turnos" aria-hidden="true">
              {Array.from({ length: turnosMes }, (_, i) => (
                <span key={i} style={{ animationDelay: `${Math.min(i, 40) * 12}ms` }} />
              ))}
            </div>
            <p className="calc__leyenda">
              <span aria-hidden="true" /> Cada cuadradito es un turno perdido en el mes ({turnosMes} en total).
            </p>

            <p className="calc__cierre">
              Con reservas online y seña, esos horarios se vuelven a ofrecer solos, y si alguien falta, la seña queda
              para vos. <b>{OFERTA.titulo}</b>: probalo y fijate cuántos turnos recuperás.
            </p>
            <a className="btn btn--accent calc__cta" href="#contacto">
              Contanos tus números <LuArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
