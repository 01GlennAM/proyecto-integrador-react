/* ============================================================
   All Store — context/AuthContext.jsx

   Reemplaza a auth.js + las partes de sesión/usuario de utils.js
   y perfil.js.

   CORRECCIÓN DE BUG (confirmada con el cliente): el proyecto
   original usaba claves de localStorage inconsistentes entre
   archivos (educlic_usuario, Allstore_usuario, allstore_usuario,
   Allstore_pedidos, allstore_pedidos...), lo que hacía que el
   nombre de usuario nunca se pintara en el header y que el
   historial de pedidos nunca apareciera en Perfil. Aquí se
   unifica todo bajo dos claves únicas, gestionadas solo desde
   este contexto:

     allstore_session  → { nombre, email }
     allstore_orders    → [ { numero, fecha, total, items } ]
============================================================ */

import { createContext, useState, useEffect, useCallback } from "react";
import { registrarUsuarioMock, validarLogin } from "../services/mockApi";

const SESSION_KEY = "allstore_session";
const ORDERS_KEY = "allstore_orders";
export const MAX_LOGIN_ATTEMPTS = 3;

export const AuthContext = createContext(null);

function leerSesionGuardada() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function leerPedidosGuardados() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada);
  const [pedidos, setPedidos] = useState(leerPedidosGuardados);
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(pedidos));
  }, [pedidos]);

  /** Devuelve { ok, bloqueado, mensaje } igual que el flujo de auth.js original */
  const login = useCallback(
    async (nombreUsuario, clave) => {
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        return { ok: false, bloqueado: true, mensaje: "Acceso bloqueado. Demasiados intentos fallidos." };
      }

      const usuarioValido = await validarLogin(nombreUsuario, clave);

      if (usuarioValido) {
        setUsuario({ nombre: usuarioValido.nombre, email: usuarioValido.email });
        setLoginAttempts(0);
        return { ok: true, mensaje: `¡Bienvenido, ${usuarioValido.nombre}!` };
      }

      const intentos = loginAttempts + 1;
      setLoginAttempts(intentos);

      if (intentos >= MAX_LOGIN_ATTEMPTS) {
        return { ok: false, bloqueado: true, mensaje: "Acceso bloqueado. Demasiados intentos fallidos." };
      }

      return {
        ok: false,
        bloqueado: false,
        mensaje: `Credenciales incorrectas. Intento ${intentos} de ${MAX_LOGIN_ATTEMPTS}.`,
        intentos
      };
    },
    [loginAttempts]
  );

  const registrar = useCallback(async (datos) => {
    const resultado = await registrarUsuarioMock(datos);

    if (resultado.ok) {
      setUsuario({ nombre: resultado.usuario.nombre, email: resultado.usuario.email });
      setLoginAttempts(0);
    }

    return resultado;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  const agregarPedido = useCallback((pedido) => {
    setPedidos((prev) => [{ ...pedido, usuarioEmail: usuario?.email }, ...prev]);
  }, [usuario]);

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    login,
    registrar,
    logout,
    loginAttempts,
    pedidos,
    agregarPedido
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}