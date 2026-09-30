// Todo lo que cambia cuando elijan el nombre definitivo está acá.

export const MARCA = {
  nombre: "Turnia",
  bajada: "Software para negocios que viven de los turnos",
  email: "[email@tumarca.com.ar]",
  instagram: "[@tumarca]",
  anio: 2026,
};

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
