// Datos del complejo inventado que se muestra en la demo de Hay Cancha.

export type DeporteId = "f7" | "f5" | "padel";

export interface Cancha {
  id: string;
  nombre: string;
  detalle: string;
}

export interface Horario {
  hora: string;
  precio: number;
}

export interface Deporte {
  id: DeporteId;
  nombre: string;
  duracion: number;
  sena: number;
  canchas: Cancha[];
  horarios: Horario[];
}

export const COMPLEJO = {
  nombre: "Complejo El Potrero",
  slug: "el-potrero",
  iniciales: "EP",
  servicios: ["Vestuarios", "Estacionamiento", "Buffet"],
  horasCancelacion: 24,
  minutosParaPagar: 10,
};

export const DEPORTES: Deporte[] = [
  {
    id: "f7",
    nombre: "Fútbol 7",
    duracion: 60,
    sena: 15000,
    canchas: [
      { id: "c1", nombre: "Cancha 1", detalle: "Techada" },
      { id: "c2", nombre: "Cancha 2", detalle: "Techada" },
      { id: "c3", nombre: "Cancha 3", detalle: "Descubierta" },
      { id: "c4", nombre: "Cancha 4", detalle: "Descubierta" },
    ],
    horarios: [
      { hora: "18:00", precio: 60000 },
      { hora: "19:00", precio: 60000 },
      { hora: "20:00", precio: 60000 },
      { hora: "21:00", precio: 65000 },
      { hora: "22:00", precio: 65000 },
      { hora: "23:00", precio: 65000 },
    ],
  },
  {
    id: "f5",
    nombre: "Fútbol 5",
    duracion: 60,
    sena: 10000,
    canchas: [{ id: "c5", nombre: "Cancha 5", detalle: "Techada" }],
    horarios: [
      { hora: "18:00", precio: 45000 },
      { hora: "19:00", precio: 45000 },
      { hora: "20:00", precio: 45000 },
      { hora: "21:00", precio: 50000 },
      { hora: "22:00", precio: 50000 },
      { hora: "23:00", precio: 50000 },
    ],
  },
  {
    id: "padel",
    nombre: "Pádel",
    duracion: 90,
    sena: 8000,
    canchas: [
      { id: "p1", nombre: "Pádel 1", detalle: "Blindex" },
      { id: "p2", nombre: "Pádel 2", detalle: "Blindex" },
    ],
    horarios: [
      { hora: "17:00", precio: 36000 },
      { hora: "18:30", precio: 36000 },
      { hora: "20:00", precio: 40000 },
      { hora: "21:30", precio: 40000 },
      { hora: "23:00", precio: 36000 },
    ],
  },
];

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export interface Dia {
  indice: number;
  corto: string;
  numero: number;
  largo: string;
  clave: string;
}

/** Los próximos días desde hoy, con las etiquetas que muestra la página. */
export function proximosDias(cantidad = 7): Dia[] {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Array.from({ length: cantidad }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const fecha = `${d.getDate()}/${d.getMonth() + 1}`;
    return {
      indice: i,
      corto: i === 0 ? "Hoy" : i === 1 ? "Mañana" : DIAS_CORTOS[d.getDay()],
      numero: d.getDate(),
      largo: i === 0 ? `Hoy ${fecha}` : i === 1 ? `Mañana ${fecha}` : `${DIAS_LARGOS[d.getDay()]} ${fecha}`,
      clave: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    };
  });
}

function minutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** true si el horario de hoy ya empezó. */
export function yaPaso(dia: Dia, hora: string): boolean {
  if (dia.indice !== 0) return false;
  const ahora = new Date();
  return minutos(hora) <= ahora.getHours() * 60 + ahora.getMinutes();
}

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100;
}

/** Ocupación "de fábrica" de la demo: siempre la misma para una misma fecha. */
export function ocupadaDeBase(deporte: DeporteId, dia: Dia, hora: string, cancha: string): boolean {
  const pico = minutos(hora) >= minutos("20:00") && minutos(hora) <= minutos("22:00");
  return hash(`${deporte}|${dia.clave}|${hora}|${cancha}`) < (pico ? 60 : 35);
}

/** "21:00" + 90 min → "22:30" */
export function horaFin(hora: string, duracion: number): string {
  const total = minutos(hora) + duracion;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
