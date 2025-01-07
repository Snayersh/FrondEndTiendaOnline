import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Usuarios.css";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargar, setCargar] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("Rol");

  useEffect(() => {
    if (rol !== "1") {
      alert("Acceso denegado. Solo los operadores pueden acceder.");
      navigate("/login");
    } else {
      obtenerClientes();
    }
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/Clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(response.data);
      setCargar(false);
    } catch (error) {
      console.error("Error al buscar los clientes:", error);
      alert("No tienes permiso para acceder a esta página.");
      navigate("/login");
    }
  };

  const handleActualizarCliente = (id) => {
    navigate(`/ActualizarCliente/${id}`);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/Clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cliente eliminado con éxito");
      obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      alert("Error al eliminar el cliente: " + error.message);
    }
  };

  if (cargar) return <div className="loading">Cargando clientes...</div>;

  return (
    <div className="usuarios-container">
      <h1>Lista de Clientes</h1>
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Razón Social</th>
            <th>Nombre Comercial</th>
            <th>Dirección de Entrega</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.idClientes}>
              <td>{cliente.idClientes}</td>
              <td>{cliente.razon_social}</td>
              <td>{cliente.nombre_comercial}</td>
              <td>{cliente.direccion_entrega}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.email}</td>
              <td className="acciones">
                <button
                  onClick={() => handleActualizarCliente(cliente.idClientes)}
                >
                  Actualizar
                </button>
                <button onClick={() => handleEliminar(cliente.idClientes)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaClientes;
