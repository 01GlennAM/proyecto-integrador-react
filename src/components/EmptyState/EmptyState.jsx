/**
 * Mensaje de estado vacío reutilizable. Reemplaza a
 * #destacados-vacio, #productos-vacio, #carrito-vacio y
 * #pedidos-vacio, que en el proyecto original eran el mismo
 * patrón (clase .estado-vacio) repetido en cada HTML.
 */
export default function EmptyState({ message, children }) {
  return <p className="estado-vacio">{children || message}</p>;
}