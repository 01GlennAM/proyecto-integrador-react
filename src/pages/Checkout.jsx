import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { confirmarPedidoMock } from "../services/mockApi";
import { formatearPrecio } from "../utils/formatters";
import EmptyState from "../components/EmptyState/EmptyState";
import Loader from "../components/Loader/Loader";
import "./Checkout.css";

/**
 * Reemplaza checkout.html + checkout.js. Mismas reglas de
 * validación (campos completos, tarjeta 16 dígitos, cvv 3
 * dígitos), mismo autoformato de tarjeta/fecha, y el pedido
 * confirmado se guarda ahora vía agregarPedido() de useAuth en
 * vez de tocar "Allstore_pedidos" directamente en localStorage.
 */
export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito } = useCart();
  const { usuario, agregarPedido } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    tarjeta: "",
    fecha: "",
    cvv: ""
  });
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState({ tipo: "", texto: "" });
  const [confirmado, setConfirmado] = useState(false);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function formatearTarjeta(valor) {
    const soloDigitos = valor.replace(/\D/g, "").substring(0, 16);
    return soloDigitos.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatearFecha(valor) {
    let val = valor.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2);
    return val;
  }

  async function confirmarCompra() {
    const { nombre, direccion, ciudad, fecha, cvv } = form;
    const tarjeta = form.tarjeta.replace(/\s/g, "");

    const reglas = [
      {
        test: () => !nombre || !direccion || !ciudad || !tarjeta || !fecha || !cvv,
        msg: "Por favor completa todos los campos."
      },
      { test: () => tarjeta.length !== 16, msg: "El número de tarjeta debe tener 16 dígitos." },
      { test: () => cvv.length !== 3, msg: "El CVV debe tener 3 dígitos." }
    ];

    const reglaFallida = reglas.find((regla) => regla.test());

    if (reglaFallida) {
      setResultado({ tipo: "error", texto: reglaFallida.msg });
      return;
    }

    setCargando(true);
    const respuesta = await confirmarPedidoMock({ carrito, total: totalPrecio, nombre, direccion, ciudad });
    setCargando(false);

    agregarPedido({
      numero: respuesta.numeroPedido,
      fecha: new Date().toLocaleDateString("es-CO"),
      total: totalPrecio,
      items: carrito.length,
      usuarioEmail: usuario.email
    });

    vaciarCarrito();

    setResultado({
      tipo: "success",
      texto: `¡Compra confirmada! Pedido ${respuesta.numeroPedido}. Gracias por tu compra, ${nombre}.`
    });
    setConfirmado(true);
  }

  const carritoVacio = carrito.length === 0;

  return (
    <>
      <h2 className="section-heading" style={{ textAlign: "center" }}>
        💳 Finalizar compra
      </h2>

      <div className="checkout-content">
        <div className="checkout-resumen-wrap">
          <h3>Resumen del pedido</h3>
          <div id="checkout-resumen">
            {carritoVacio ? (
              <EmptyState message="Tu carrito está vacío." />
            ) : (
              <>
                {carrito.map((item, index) => (
                  <div className="checkout-item" key={index}>
                    <span>
                      {item.imagen} {item.nombre} × {item.cantidad}
                    </span>
                    <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                  </div>
                ))}
                <div className="checkout-item checkout-total-linea">
                  <strong>Total</strong>
                  <strong>{formatearPrecio(totalPrecio)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="checkout-form-wrap">
          <h3>Datos de envío y pago</h3>

          <div className="form-group">
            <label htmlFor="pay-name">Nombre completo</label>
            <input
              type="text"
              id="pay-name"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pay-address">Dirección</label>
            <input
              type="text"
              id="pay-address"
              placeholder="Calle 10 # 20-30"
              value={form.direccion}
              onChange={(e) => actualizar("direccion", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pay-city">Ciudad</label>
            <input
              type="text"
              id="pay-city"
              placeholder="Medellín"
              value={form.ciudad}
              onChange={(e) => actualizar("ciudad", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pay-card">Número de tarjeta (simulado)</label>
            <input
              type="text"
              id="pay-card"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={form.tarjeta}
              onChange={(e) => actualizar("tarjeta", formatearTarjeta(e.target.value))}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pay-date">Vencimiento</label>
              <input
                type="text"
                id="pay-date"
                placeholder="MM/AA"
                maxLength={5}
                value={form.fecha}
                onChange={(e) => actualizar("fecha", formatearFecha(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pay-cvv">CVV</label>
              <input
                type="text"
                id="pay-cvv"
                placeholder="123"
                maxLength={3}
                value={form.cvv}
                onChange={(e) => actualizar("cvv", e.target.value.replace(/\D/g, "").substring(0, 3))}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={carritoVacio || confirmado}
            onClick={confirmarCompra}
          >
            Confirmar compra
          </button>
          {resultado.texto && (
            <div className={`checkout-result ${resultado.tipo}`}>{resultado.texto}</div>
          )}
        </div>
      </div>

      <Loader visible={cargando} />
    </>
  );
}
