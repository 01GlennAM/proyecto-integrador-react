import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MAX_LOGIN_ATTEMPTS } from "../context/AuthContext";
import Loader from "../components/Loader/Loader";
import "./Login.css";

/**
 * Reemplaza login.html + auth.js. Conserva: límite de 3 intentos,
 * bloqueo de inputs/botón tras 3 fallos, mensajes de éxito/error/
 * bloqueado, envío con Enter, y redirección automática si ya hay
 * sesión activa (antes se hacía leyendo localStorage directo en
 * initLogin(), ahora vía isAuthenticated de useAuth).
 */
export default function Login() {
  const { login, registrar, isAuthenticated, loginAttempts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/";

  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [modo, setModo] = useState("login");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const bloqueado = loginAttempts >= MAX_LOGIN_ATTEMPTS;

  // Si ya hay sesión activa, respeta también el destino solicitado.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, isAuthenticated, navigate]);

  async function intentarLogin() {
    if (bloqueado) return;

    const usuarioTrim = usuario.trim();
    const claveTrim = clave.trim();

    if (!usuarioTrim || !claveTrim) {
      setMensaje({ tipo: "error", texto: "Completa usuario y contraseña." });
      return;
    }

    setCargando(true);
    const resultado = await login(usuarioTrim, claveTrim);
    setCargando(false);

    if (resultado.ok) {
      setMensaje({ tipo: "success", texto: resultado.mensaje });
      setTimeout(() => navigate(destination, { replace: true }), 600);
    } else {
      setMensaje({ tipo: resultado.bloqueado ? "blocked" : "error", texto: resultado.mensaje });
      setClave("");
    }
  }

  async function intentarRegistro() {
    const nombreTrim = nombre.trim();
    const emailTrim = usuario.trim();
    const claveTrim = clave.trim();

    if (!nombreTrim || !emailTrim || !claveTrim) {
      setMensaje({ tipo: "error", texto: "Completa nombre, correo y contraseña." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setMensaje({ tipo: "error", texto: "Ingresa un correo electrónico válido." });
      return;
    }

    if (claveTrim.length < 8) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }

    setCargando(true);
    const resultado = await registrar({ nombre: nombreTrim, email: emailTrim, clave: claveTrim });
    setCargando(false);

    if (resultado.ok) {
      setMensaje({ tipo: "success", texto: `Cuenta creada. ¡Bienvenido, ${nombreTrim}!` });
      setTimeout(() => navigate(destination, { replace: true }), 600);
    } else {
      setMensaje({ tipo: "error", texto: resultado.mensaje });
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      if (modo === "login") intentarLogin();
      else intentarRegistro();
    }
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setMensaje({ tipo: "", texto: "" });
  }

  return (
    <div className="login-card">
      <div className="logo-wrap">
        <span className="logo-icon">🛍️</span>
        <h1 className="logo-text">All Store</h1>
        <p className="logo-sub">Tenis, gorras y ropa urbana</p>
      </div>

      {modo === "registro" && (
        <div className="form-group">
          <label htmlFor="input-name">Nombre</label>
          <input
            type="text"
            id="input-name"
            placeholder="Tu nombre completo"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="input-user">{modo === "login" ? "Correo o usuario" : "Correo electrónico"}</label>
        <input
          type={modo === "login" ? "text" : "email"}
          id="input-user"
          placeholder={modo === "login" ? "cliente o correo@ejemplo.com" : "tu@correo.com"}
          autoComplete="email"
          value={usuario}
          disabled={modo === "login" && bloqueado}
          onChange={(e) => setUsuario(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="form-group">
        <label htmlFor="input-pass">Contraseña</label>
        <input
          type="password"
          id="input-pass"
          placeholder="••••••••"
          autoComplete={modo === "login" ? "current-password" : "new-password"}
          value={clave}
          disabled={modo === "login" && bloqueado}
          onChange={(e) => setClave(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        className="btn-primary"
        disabled={modo === "login" && bloqueado}
        onClick={modo === "login" ? intentarLogin : intentarRegistro}
      >
        {modo === "login" ? "Ingresar" : "Crear cuenta"}
      </button>

      {mensaje.texto && <p className={`login-msg ${mensaje.tipo}`}>{mensaje.texto}</p>}

      <button
        type="button"
        className="login-mode-toggle"
        onClick={() => cambiarModo(modo === "login" ? "registro" : "login")}
      >
        {modo === "login" ? "¿No tienes cuenta? Crear cuenta" : "¿Ya tienes cuenta? Ingresar"}
      </button>

      {modo === "login" && (
        <p className="login-hint">
          Usuario de prueba: <strong>cliente</strong> / <strong>1234</strong>
        </p>
      )}

      <Loader visible={cargando} />
    </div>
  );
}
