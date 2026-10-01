/**
 * Grupo de botones tipo toggle (usado para Talla y Color en el
 * detalle de producto). Reemplaza el bloque duplicado en
 * producto.js que construía tallas-wrap y colores-wrap con
 * createElement + toggle manual de la clase "active".
 */
export default function OptionSelector({ label, opciones, valorSeleccionado, onSeleccionar }) {
  return (
    <div className="opciones-grupo">
      <label>{label}</label>
      <div className="opciones-lista">
        {opciones.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={`btn-opcion ${valorSeleccionado === opcion ? "active" : ""}`}
            onClick={() => onSeleccionar(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
}