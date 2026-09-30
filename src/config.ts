// Todo lo que cambia cuando elijan el nombre definitivo está acá.

export const MARCA = {
  nombre: "Turnia",
  bajada: "Software para negocios que viven de los turnos",
  email: "[email@tumarca.com.ar]",
  instagram: "[@tumarca]",
  /** Celular con característica, sin 0 ni 15. Se muestra como canal de contacto (el principal es el formulario). */
  whatsapp: "2213523930",
  anio: 2026,
};

/** "2213523930" → "221 352-3930" */
export function whatsappVisible(numero: string): string {
  return numero.replace(/^(\d+)(\d{3})(\d{4})$/, "$1 $2-$3");
}

/** Link que abre el chat. Para celulares de Argentina el formato internacional es 54 9 + número. */
export function whatsappLink(numero: string, mensaje?: string): string {
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/549${numero}${texto}`;
}

export const HAY_CANCHA = {
  /**
   * Dirección de la web de Hay Cancha. Los botones "Ver Hay Cancha" llevan acá, en otra pestaña.
   * Si la dejás vacía, esos botones abren la demo que está dentro de esta landing.
   */
  url: "https://haycancha-web.onrender.com/",
};

/** La oferta de arranque. Se muestra en la portada, la calculadora, las preguntas y el contacto. */
export const OFERTA = {
  titulo: "El primer mes es gratis",
  detalle: "Después, un abono mensual fijo.",
};

export type EstadoProducto = "lanzamiento" | "proximamente";

export const PRODUCTOS = [
  {
    id: "cancha",
    nombre: "Hay Cancha",
    rubro: "Canchas y complejos deportivos",
    estado: "lanzamiento" as EstadoProducto,
  },
  {
    id: "pelu",
    nombre: "Peluquerías",
    rubro: "Peluquerías y barberías",
    estado: "proximamente" as EstadoProducto,
  },
  {
    id: "resto",
    nombre: "Restaurantes",
    rubro: "Restaurantes y rotiserías",
    estado: "proximamente" as EstadoProducto,
  },
] as const;

export type ProductoId = (typeof PRODUCTOS)[number]["id"];

export const ETIQUETA_ESTADO: Record<EstadoProducto, string> = {
  lanzamiento: "En lanzamiento",
  proximamente: "Próximamente",
};
