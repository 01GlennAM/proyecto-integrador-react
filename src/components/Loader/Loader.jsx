import "./Loader.css";

/**
 * Overlay de carga. Reemplaza a #loader + showLoader()/hideLoader()
 * de utils.js: antes se manipulaba una clase "hidden" en el DOM,
 * ahora es puramente condicional vía renderizado ({visible && ...}).
 */
export default function Loader({ visible }) {
  if (!visible) return null;

  return (
    <div className="loader">
      <div className="spinner" />
    </div>
  );
}