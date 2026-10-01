import { useNavigate } from "react-router-dom";
import { formatearPrecio } from "../../utils/formatters";

/**
 * Tarjeta de producto para las grillas de Home y Productos.
 * Reemplaza crearTarjetaProducto() de productos.js y el bloque
 * equivalente inline en el script de index.html (eran idénticos
 * salvo el badge de agotado, que aquí se conserva).
 */
export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  const sinStock = producto.stock === 0;

  return (
    <div className="product-card" onClick={() => navigate(`/productos/${producto.id}`)}>
      <div className="product-imagen">{producto.imagen}</div>
      <div className="product-main">
        <span className="product-categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="product-precio">{formatearPrecio(producto.precio)}</p>
        {sinStock && <span className="badge-agotado">Agotado</span>}
      </div>
    </div>
  );
}