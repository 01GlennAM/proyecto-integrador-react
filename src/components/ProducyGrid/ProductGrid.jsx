import ProductCard from "../ProductCard/ProductCard";
import EmptyState from "../EmptyState/EmptyState";

/**
 * Grilla de productos reutilizada en Home (destacados) y en
 * Productos (catálogo filtrado). Reemplaza renderProductos() de
 * productos.js y el bloque equivalente en index.html.
 */
export default function ProductGrid({ productos, emptyMessage }) {
  if (productos.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="products-grid">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}