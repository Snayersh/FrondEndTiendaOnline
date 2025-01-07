import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Datos.css";
const Datos = () => {
  const navigate = useNavigate();
  const rolUsuario = localStorage.getItem("Rol");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || rolUsuario !== "1") {
      alert("No tienes acceso a esta página. Inicia sesión nuevamente.");
      navigate("/login");
    }
  }, [rolUsuario, token, navigate]);

  return (
    <div className="navigation-page">
      <h1>Menu Administrativo</h1>
      <div className="button-container">
        <button onClick={() => navigate("/Productos")}>
          Lista de Productos
        </button>
        <button onClick={() => navigate("/Carrito")}>Carrito</button>
        <button onClick={() => navigate("/NuevoProducto")}>
          Nuevo Producto
        </button>
        <button onClick={() => navigate("/NuevaCategoria")}>
          Nueva Categoria
        </button>
        <button onClick={() => navigate("/Pedidos")}>Lista Ordenes</button>
        <button onClick={() => navigate("/Usuarios")}>Lista de Usuarios</button>
        <button onClick={() => navigate("/NuevoCliente")}>Nuevo Cliente</button>
        <button onClick={() => navigate("/ListaClientes")}>
          Lista de Clientes
        </button>
      </div>
    </div>
  );
};

export default Datos;
