import { Outlet } from "react-router-dom";

/** Layout exclusivo de Login. Reemplaza el wrapper .login-bg de login.html. */
export default function AuthLayout() {
  return (
    <div className="login-bg">
      <Outlet />
    </div>
  );
}
