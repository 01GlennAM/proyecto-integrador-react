import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../services/mockApi";
import { useCart } from "../hooks/useCart";
import { formatearPrecio } from "../utils/formatters";
import OptionSelector from "../components/OptionSelector/OptionSelector";
import EmptyState from "../components/EmptyState/EmptyState";
import Loader from "../components/Loader/Loader";
import "./ProductoDetalle.css";

/**
 * Reemplaza producto.html + producto.js. El id ya no se lee de
 * ?id= sino del parámetro de ruta /productos/:id (useParams),
 * como pedía el punto 8 de la migración. Selección de talla/color,
 * selector de cantidad con límite de stock y feedback temporal
 * al agregar se conservan igual que el original.
 */
export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [talla, setTalla] = useState(null);
  const [color, setColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    obtenerProductoPorId(id).then((data) => {
      if (activo) {
        setProducto(data);
        setTalla(data?.tallas?.[0] ?? null);
        setColor(data?.colores?.[0] ?? null);
        setCantidad(1);
        setCargando(false);
      }
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) return <Loader visible />;

  if (!producto) {
    return (
      <div className="detail-content">
        <EmptyState message="Producto no encontrado." />
      </div>
    );
  }

  const sinStock = producto.stock === 0;

  function restar() {
    setCantidad((c) => Math.max(1, c - 1));
  }

  function sumar() {
    setCantidad((c) => Math.min(producto.stock || 99, c + 1));
  }

  function handleAgregar() {
    agregarAlCarrito(producto, cantidad, talla, color);
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2000);
  }

  return (
    <div id="detail-content" className="detail-content">
      <div className="detail-imagen-wrap">
        <span>{producto.imagen}</span>
      </div>

      <div className="detail-info">
        <span className="product-categoria">{producto.categoria}</span>
        <h2>{producto.nombre}</h2>
        <span className="product-precio">{formatearPrecio(producto.precio)}</span>
        <p className="detail-desc">{producto.descripcion}</p>

        <OptionSelector label="Talla" opciones={producto.tallas} valorSeleccionado={talla} onSeleccionar={setTalla} />
        <OptionSelector label="Color" opciones={producto.colores} valorSeleccionado={color} onSeleccionar={setColor} />

        <div className="opciones-grupo">
          <label>Cantidad</label>
          <div className="selector-cantidad">
            <button type="button" className="btn-qty" onClick={restar} disabled={sinStock}>
              −
            </button>
            <input type="number" value={cantidad} readOnly min="1" />
            <button type="button" className="btn-qty" onClick={sumar} disabled={sinStock}>
              +
            </button>
          </div>
        </div>

        <p className={`stock-msg ${sinStock ? "agotado" : "disponible"}`}>
          {sinStock ? "Producto agotado" : `${producto.stock} disponibles`}
        </p>

        <button className="btn-primary" disabled={sinStock} onClick={handleAgregar}>
          🛒 Agregar al carrito
        </button>

        {feedback && <p id="agregar-feedback">Producto agregado al carrito</p>}
      </div>
    </div>
  );
}
