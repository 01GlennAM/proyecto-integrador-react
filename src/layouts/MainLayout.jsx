import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

/**
 * Layout compartido por todas las páginas internas. Evita repetir
 * el mismo <nav class="topbar"> en cada HTML. Cada página, vía
 * contexto de ruta (ver AppRoutes), le indica a Navbar si debe
 * mostrar el buscador y a dónde apunta el botón "volver", igual
 * a como cada HTML original tenía su propio onclick.
 */
export default function MainLayout({ showSearch, backTo, backLabel }) {
  return (
    <>
      <Navbar showSearch={showSearch} backTo={backTo} backLabel={backLabel} />
      <Outlet />
    </>
  );
}