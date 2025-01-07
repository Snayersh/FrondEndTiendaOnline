import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Usuarios.css";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargar, setCargar] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("Rol");

  useEffect(() => {
    if (rol !== "1") {
      alert("Acceso denegado. Solo los operadores pueden acceder.");
      navigate("/login");
    } else {
      obtenerUsuarios();
    }
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const UsuariosSeparados = response.data.map((usuario) => ({
        id: usuario.idusuarios,
        nombre_completo: usuario.nombre_completo,
        correo_electronico: usuario.correo_electronico,
        telefono: usuario.telefono,
        estado: obtenerEstado(usuario.estados_idestados),
      }));
      setUsuarios(UsuariosSeparados);
      setCargar(false);
    } catch (error) {
      console.error("Error al buscar los usuarios:", error);
      alert("No tienes permiso para acceder a esta página.");
      navigate("/login");
    }
  };

  const obtenerEstado = (estados_idestados) => {
    const estado = {
      1: "Activo",
      2: "Inactivo",
      3: "Pendiente",
      4: "En tránsito",
      5: "Entregado",
    };
    return estado[estados_idestados];
  };

  const handleActualizarUsuario = (id) => {
    navigate(`/ActualizarUsuario/${id}`);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/usuarioDel/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Usuario eliminado con éxito");
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar un usuario:", error);
      alert("Error al eliminar un usuario: " + error.message);
    }
  };

  if (cargar) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="usuarios-container">
      <h1>Lista de Usuarios</h1>
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.correo_electronico}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.estado}</td>
              <td className="acciones">
                <button onClick={() => handleActualizarUsuario(usuario.id)}>
                  Actualizar
                </button>
                <button onClick={() => handleEliminar(usuario.id)}>
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

export default ListaUsuarios;
