import { Navigate } from "react-router-dom";

const Proteccion = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("Rol");

  if (!token) {
    alert("Acceso Denegado");
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(rol)) {
    alert("No tienes permisos para acceder");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Proteccion;
