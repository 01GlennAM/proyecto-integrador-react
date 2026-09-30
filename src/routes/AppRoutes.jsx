import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Productos from "../pages/Productos";
import ProductoDetalle from "../pages/ProductoDetalle";
import Carrito from "../pages/Carrito";
import Checkout from "../pages/Checkout";
import Perfil from "../pages/Perfil";

/** Cada grupo mantiene el layout y la navegación propios de la página. */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Pública ---------- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ---------- Páginas públicas de exploración y compra ---------- */}
      <Route
        element={
          <MainLayout showSearch />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
      </Route>

      {/* ---------- Checkout protegido: botón "volver al carrito" ---------- */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout backTo="/carrito" backLabel="← Volver al carrito" />
          </ProtectedRoute>
        }
      >
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* ---------- Perfil protegido: botón "volver" a Home ---------- */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout backTo="/" backLabel="← Volver" />
          </ProtectedRoute>
        }
      >
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* ---------- Cualquier ruta desconocida ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}