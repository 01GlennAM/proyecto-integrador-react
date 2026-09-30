/* ============================================================
   All Store — utils/formatters.js
   Migrado desde utils.js. El resto de responsabilidades de
   utils.js (loader, sesión, carrito, header) se reparte ahora
   en hooks/contextos y componentes React equivalentes.
============================================================ */

/** Formatea un número como precio en pesos colombianos, ej: $220.000 COP */
export function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CO") + " COP";
}