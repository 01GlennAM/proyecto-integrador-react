/* ============================================================
   All Store — services/api.js

   PLACEHOLDER para Fase 3 (integración con backend real).
   Todavía NO se usa en ninguna página ni componente: en esta
   fase toda la app consume exclusivamente services/mockApi.js.

   Cuando exista el backend, cada función de aquí reemplazará a
   su equivalente en mockApi.js manteniendo la misma firma, para
   que el cambio en los componentes sea mínimo (idealmente solo
   el import).

   Ejemplo de cómo se vería cada función una vez haya backend:

     export async function obtenerProductos() {
       const response = await fetch("/api/productos");
       if (!response.ok) throw new Error("Error al obtener productos");
       return await response.json();
     }
============================================================ */

const BASE_URL = "/api"; // pendiente de definir cuando exista backend

export async function obtenerProductos() {
  throw new Error("api.js aún no está conectado a un backend real (Fase 3 pendiente).");
}

export async function obtenerProductoPorId(id) {
  throw new Error("api.js aún no está conectado a un backend real (Fase 3 pendiente).");
}

export async function obtenerCategorias() {
  throw new Error("api.js aún no está conectado a un backend real (Fase 3 pendiente).");
}

export async function validarLogin(usuario, clave) {
  throw new Error("api.js aún no está conectado a un backend real (Fase 3 pendiente).");
}

export async function confirmarPedidoMock(pedido) {
  throw new Error("api.js aún no está conectado a un backend real (Fase 3 pendiente).");
}