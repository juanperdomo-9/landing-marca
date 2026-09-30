export type Rubro = "cancha" | "pelu" | "resto" | "otro";

export interface DatosContacto {
  nombre: string;
  negocio: string;
  rubro: Rubro;
  contacto: string;
  mensaje: string;
}

/**
 * Clave de Web3Forms (https://web3forms.com): ponés tu email en su página, te mandan la clave
 * y cada consulta del formulario te llega a ese email. No hace falta base de datos ni servidor.
 * Es una clave pública (está pensada para ir en la página), así que puede quedar acá.
 * Mientras esté vacía, el formulario funciona en modo vista previa y no envía nada.
 */
export const WEB3FORMS_CLAVE: string = "6e631d8c-87d1-4c6f-8ff1-5e28afe7e55e";

export const FORMULARIO_CONECTADO = WEB3FORMS_CLAVE !== "";

const NOMBRE_RUBRO: Record<Rubro, string> = {
  cancha: "Cancha o complejo",
  pelu: "Peluquería o barbería",
  resto: "Restaurante o rotisería",
  otro: "Otro rubro",
};

const ES_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Link de WhatsApp a partir de un celular argentino escrito como venga:
 * "221 15 352-3930", "0221 352 3930", "+54 9 221 3523930"… → https://wa.me/5492213523930
 */
export function whatsappDeCelular(texto: string): string {
  let n = texto.replace(/\D/g, "");
  n = n.replace(/^549?/, "").replace(/^0/, "");
  // Característica (2 a 4 dígitos) + 15 + número: se saca el 15 para llegar a los 10 dígitos.
  if (n.length === 12) {
    for (const largo of [2, 3, 4]) {
      if (n.slice(largo, largo + 2) === "15") {
        n = n.slice(0, largo) + n.slice(largo + 2);
        break;
      }
    }
  }
  return `https://wa.me/549${n}`;
}

export async function enviarContacto(datos: DatosContacto): Promise<void> {
  if (!FORMULARIO_CONECTADO) {
    await new Promise((resolver) => setTimeout(resolver, 900));
    return;
  }

  const contacto = datos.contacto.trim();
  const esEmail = ES_EMAIL.test(contacto);

  const r = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_CLAVE,
      subject: `Nueva consulta de ${datos.negocio.trim()} (${NOMBRE_RUBRO[datos.rubro]})`,
      from_name: "Landing de Turnia",
      // Si dejó email, al tocar "Responder" le escribís directo a él.
      ...(esEmail ? { replyto: contacto } : {}),
      Nombre: datos.nombre.trim(),
      Negocio: datos.negocio.trim(),
      Rubro: NOMBRE_RUBRO[datos.rubro],
      "Celular o email": contacto,
      // Si dejó celular, un link para abrirle el chat con un toque.
      ...(esEmail ? {} : { "Escribirle por WhatsApp": whatsappDeCelular(contacto) }),
      Mensaje: datos.mensaje.trim() || "(sin mensaje)",
    }),
  });

  const respuesta = (await r.json().catch(() => null)) as { success?: boolean } | null;
  if (!r.ok || !respuesta?.success) throw new Error("No se pudo enviar");
}
