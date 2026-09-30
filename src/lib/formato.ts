/** 65000 → "$65.000" */
export function pesos(n: number): string {
  const entero = Math.round(n).toString();
  return "$" + entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
