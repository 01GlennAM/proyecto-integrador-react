/* ============================================================
   All Store — context/CartContext.jsx

   Reemplaza a carrito.js y a los helpers de carrito de utils.js
   (obtenerCarrito, guardarCarrito, contarItemsCarrito,
   actualizarBadgeCarrito). El carrito sigue persistiendo en
   localStorage para sobrevivir entre navegación/recargas, igual
   que en el proyecto original, pero ahora bajo una única clave
   consistente: allstore_cart.
============================================================ */

import { createContext, useState, useEffect, useCallback, useMemo } from "react";

const CART_KEY = "allstore_cart";

export const CartContext = createContext(null);

function leerCarritoGuardado() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoGuardado);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  }, [carrito]);

  /** Igual que producto.js: suma cantidad si ya existe misma combinación id+talla+color */
  const agregarAlCarrito = useCallback((producto, cantidad, talla, color) => {
    setCarrito((prev) => {
      const existente = prev.find(
        (item) => item.id === producto.id && item.talla === talla && item.color === color
      );

      if (existente) {
        return prev.map((item) =>
          item === existente ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          talla,
          color,
          cantidad
        }
      ];
    });
  }, []);

  /** Igual que cambiarCantidad en carrito.js: elimina la fila si la cantidad llega a 0 */
  const cambiarCantidad = useCallback((index, delta) => {
    setCarrito((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], cantidad: copia[index].cantidad + delta };
      if (copia[index].cantidad <= 0) {
        copia.splice(index, 1);
      }
      return copia;
    });
  }, []);

  const eliminarDelCarrito = useCallback((index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  const totalItems = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito]
  );

  const totalPrecio = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  const value = {
    carrito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}