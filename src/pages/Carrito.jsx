import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatearPrecio } from "../utils/formatters";
import EmptyState from "../components/EmptyState/EmptyState";
import "./Carrito.css";

/**
 * Reemplaza carrito.html + carrito.js. cambiarCantidad,
 * eliminarDelCarrito, vaciarCarrito y el cálculo de subtotal/total
 * ahora viven en CartContext (useCart), no en el componente.
 */
export default function Carrito() {
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useCart();

  return (
    <div className="carrito-content">
      <h2 className="section-heading" style={{ padding: "0 0 16px" }}>
        Tu carrito
      </h2>

      {carrito.length === 0 ? (
        <EmptyState>
          Tu carrito está vacío.{" "}
          <Link to="/productos" style={{ color: "var(--mint-dark)", fontWeight: 700 }}>
            Ver productos
          </Link>
        </EmptyState>
      ) : (
        <>
          <div id="carrito-lista">
            {carrito.map((item, index) => {
              const subtotal = item.precio * item.cantidad;
              return (
                <div className="carrito-fila" key={`${item.id}-${item.talla}-${item.color}-${index}`}>
                  <div className="carrito-imagen">{item.imagen}</div>
                  <div className="carrito-info">
                    <h3>{item.nombre}</h3>
                    <p className="carrito-variante">
                      {item.talla ? `Talla: ${item.talla}` : ""} {item.color ? `· Color: ${item.color}` : ""}
                    </p>
                    <p className="carrito-precio-unit">{formatearPrecio(item.precio)} c/u</p>
                  </div>
                  <div className="carrito-cantidad">
                    <button className="btn-qty" onClick={() => cambiarCantidad(index, -1)}>
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button className="btn-qty" onClick={() => cambiarCantidad(index, 1)}>
                      +
                    </button>
                  </div>
                  <div className="carrito-subtotal">{formatearPrecio(subtotal)}</div>
                  <button className="btn-eliminar" title="Eliminar" onClick={() => eliminarDelCarrito(index)}>
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          <div className="carrito-resumen">
            <div className="carrito-total-linea">
              <span>Total</span>
              <span>{formatearPrecio(totalPrecio)}</span>
            </div>
            <div className="carrito-acciones">
              <button className="btn-secondary" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
              <Link to="/checkout">
                <button className="btn-primary">Ir a pagar</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
