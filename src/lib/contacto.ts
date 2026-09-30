export type Rubro = "cancha" | "pelu" | "resto" | "otro";

export interface DatosContacto {
  nombre: string;
  negocio: string;
  rubro: Rubro;
  contacto: string;
  mensaje: string;
}

/**
 * Cambiá a true cuando el formulario esté conectado a un backend real.
 * Mientras esté en false, la página avisa que es una vista previa.
 */
export const FORMULARIO_CONECTADO = false;

/**
 * Por ahora no manda nada: solo simula la espera.
 * Para conectarlo, reemplazá el cuerpo por un fetch a tu backend, por ejemplo:
 *
 *   const r = await fetch("/api/contacto", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(datos),
 *   });
 *   if (!r.ok) throw new Error("No se pudo enviar");
 */
export async function enviarContacto(datos: DatosContacto): Promise<void> {
  void datos;
  await new Promise((resolver) => setTimeout(resolver, 900));
}
