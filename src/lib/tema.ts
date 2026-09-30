export type Tema = "light" | "dark";

/** Dónde se guarda la elección del visitante. index.html la lee antes de pintar, para que no parpadee. */
const CLAVE = "tema";

export function temaGuardado(): Tema | null {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function temaDelSistema(): Tema {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function temaActual(): Tema {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : temaDelSistema();
}

/** Aplica el tema (tokens.css reacciona a data-theme) y lo recuerda para la próxima visita. */
export function elegirTema(t: Tema) {
  const raiz = document.documentElement;
  raiz.dataset.theme = t;
  try {
    localStorage.setItem(CLAVE, t);
  } catch {
    // Sin almacenamiento (ventana privada, bloqueado): el tema se aplica igual, solo no se recuerda.
  }
  const fondo = getComputedStyle(raiz).getPropertyValue("--bg").trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", fondo));
}
