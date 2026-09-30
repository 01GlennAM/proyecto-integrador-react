import { useAuth } from "../hooks/useAuth";
import { formatearPrecio } from "../utils/formatters";
import EmptyState from "../components/EmptyState/EmptyState";
import "./Perfil.css";

/**
 * Reemplaza perfil.html + perfil.js. Antes el nombre/email nunca
 * se veían por el bug de claves de localStorage (ver auditoría);
 * ahora vienen directo de useAuth().usuario, ya unificado. La
 * dirección se mantiene hardcodeada como en el original (no era
 * un dato real capturado en ningún formulario).
 */
export default function Perfil() {
  const { usuario, pedidos } = useAuth();
  const pedidosDelUsuario = pedidos.filter((pedido) => pedido.usuarioEmail === usuario?.email);

  return (
    <div className="perfil-content">
      <div className="perfil-card">
        <div className="perfil-avatar">👤</div>
        <div className="perfil-datos">
          <h3>{usuario?.nombre || "Cliente"}</h3>
          <p>{usuario?.email || "sin-correo@allstore.com"}</p>
          <p>Medellín, Colombia</p>
        </div>
      </div>

      <h2 className="section-heading" style={{ padding: "0 0 14px" }}>
        Historial de pedidos
      </h2>

      {pedidosDelUsuario.length === 0 ? (
        <EmptyState message="Todavía no tienes pedidos." />
      ) : (
        <div id="pedidos-lista">
          {pedidosDelUsuario.map((pedido) => (
            <div className="pedido-fila" key={pedido.numero}>
              <span>{pedido.numero}</span>
              <span>{pedido.fecha}</span>
              <span>{pedido.items} producto(s)</span>
              <strong>{formatearPrecio(pedido.total)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
