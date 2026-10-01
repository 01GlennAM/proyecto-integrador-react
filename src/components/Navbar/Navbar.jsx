import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./Navbar.css";

/**
 * Header común a todas las páginas internas. Reemplaza el <nav
 * class="topbar"> repetido en index/carrito/checkout/perfil/
 * producto/productos.html, más pintarUsuarioHeader(),
 * actualizarBadgeCarrito() e initLogoutHeader() de utils.js.
 *
 * showSearch: solo index.html tenía el buscador en el topbar.
 * backTo / backLabel: replica el botón "← volver" que cada
 * página tenía apuntando a un destino distinto.
 */
export default function Navbar({ showSearch = false, backTo, backLabel }) {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleBuscar(e) {
    if (e.key === "Enter" && e.target.value.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(e.target.value.trim())}`);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="topbar">
      <Link to="/">
        <span className="logo-text small">All Store</span>
      </Link>

      {showSearch && (
        <div className="topbar-search">
          <input
            type="text"
            placeholder="Buscar productos..."
            onKeyDown={handleBuscar}
          />
        </div>
      )}

      <div className="topbar-actions">
        {usuario && <span className="nav-user">👤 {usuario.nombre}</span>}

        <Link to="/carrito" className="nav-icon-link">
          🛒{" "}
          <span className={`cart-badge ${totalItems === 0 ? "hidden" : ""}`}>
            {totalItems}
          </span>
        </Link>

        <Link to="/perfil" className="nav-icon-link">
          👤
        </Link>

        {backTo && (
          <button className="btn-back" onClick={() => navigate(backTo)}>
            {backLabel}
          </button>
        )}

        {usuario && (
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Salir
          </button>
        )}
      </div>
    </nav>
  );
}