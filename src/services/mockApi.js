/* ============================================================
   All Store — services/mockApi.js

   Esta es la ÚNICA capa que el resto del código debe usar para
   pedir datos de productos, validar login o confirmar pedidos.
   Hoy (Fase 1) devuelve mockProductos/mockUsuarios envueltos en
   una Promise, simulando una llamada asíncrona real.

   En Fase 3, cuando exista el backend, solo habrá que reemplazar
   las llamadas a este archivo por llamadas a services/api.js.
   Los componentes/páginas nunca deberían necesitar cambios,
   porque siempre reciben una Promise que resuelve con el mismo
   formato de datos.

   Migrado 1:1 desde api.js original (mismos nombres de función).
============================================================ */

import { mockProductos, mockUsuarios } from "../data/mockProductos";

const REGISTERED_USERS_KEY = "allstore_registered_users";

function obtenerUsuariosRegistrados() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || "[]");
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

/* Simula latencia de red para que el loader tenga sentido en Fase 1 */
function delayMock(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obtenerProductos() {
  await delayMock();
  return mockProductos;
}

export async function obtenerProductoPorId(id) {
  await delayMock();
  const producto = mockProductos.find((p) => p.id === Number(id));
  return producto || null;
}

export async function obtenerCategorias() {
  await delayMock(100);
  const categorias = mockProductos.map((p) => p.categoria);
  return [...new Set(categorias)];
}

/* --- Login mock: se moverá a validación real contra el backend en Fase 3 --- */
export async function validarLogin(usuario, clave) {
  await delayMock(200);
  const identificador = usuario.trim().toLowerCase();
  const usuarios = [...mockUsuarios, ...obtenerUsuariosRegistrados()];
  return (
    usuarios.find(
      (u) =>
        (u.usuario.toLowerCase() === identificador || u.email.toLowerCase() === identificador) &&
        u.clave === clave
    ) || null
  );
}

export async function registrarUsuarioMock({ nombre, email, clave }) {
  await delayMock(200);

  const correo = email.trim().toLowerCase();
  const usuariosRegistrados = obtenerUsuariosRegistrados();
  const correoEnUso = [...mockUsuarios, ...usuariosRegistrados].some(
    (usuario) => usuario.email.toLowerCase() === correo
  );

  if (correoEnUso) {
    return { ok: false, mensaje: "Ya existe una cuenta con ese correo." };
  }

  const usuario = {
    usuario: correo,
    clave,
    nombre: nombre.trim(),
    email: correo
  };
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...usuariosRegistrados, usuario]));

  return { ok: true, usuario };
}

/* --- Checkout mock: en Fase 3 esto haría POST /api/pedidos --- */
export async function confirmarPedidoMock(pedido) {
  await delayMock(400);
  return { ok: true, numeroPedido: "EDU-" + Date.now() };
}