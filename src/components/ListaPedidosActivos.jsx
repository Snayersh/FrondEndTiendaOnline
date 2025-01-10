import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ordenes.css";

const Listapedidos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // Almacenar el rol del usuario

  // Objeto que mapea los estados
  const estados = {
    1: "Entregado",
    2: "Eliminado",
    3: "Pendiente de Confirmar",
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Por favor, inicia sesión para continuar.");
          return;
        }

        // Obtener el rol del usuario desde el localStorage
        const role = localStorage.getItem("role");
        setUserRole(role);  // Guardar el rol del usuario

        const response = await axios.get("http://localhost:3000/api/Orden", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = parseInt(localStorage.getItem("id"));
        const ordenesFiltradas = response.data.mensaje.filter(
          (orden) =>
            orden.usuarios_idusuarios === userId
        );

        setOrdenes(ordenesFiltradas);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las órdenes:", err);
        setError("Error al cargar las órdenes.");
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const handleEliminar = async (idOrden) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      await axios.post(
        `http://localhost:3000/api/OrdenDel/${idOrden}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Orden eliminada con éxito.");
      setOrdenes(ordenes.filter((orden) => orden.idOrden !== idOrden));
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      alert("Error al eliminar la orden.");
    }
  };

  const handleEntregar = async (idOrden) => {
    if (userRole !== '1') {
      alert("No tienes permiso para entregar esta orden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      await axios.post(
        `http://localhost:3000/api/OrdenEntregada/${idOrden}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Orden marcada como entregada con éxito.");
      setOrdenes(ordenes.filter((orden) => orden.idOrden !== idOrden));
    } catch (error) {
      console.error("Error al marcar la orden como entregada:", error);
      alert("Error al marcar la orden como entregada.");
    }
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p>{error}</p>;
  if (ordenes.length === 0) return <p>No hay órdenes disponibles.</p>;

  return (
    <div className="ordenes-container">
      <h1>Lista de Órdenes</h1>
      <ul className="ordenes-lista">
        {ordenes.map((orden) => (
          <li key={orden.idOrden} className="orden-item">
            <div>
              <p>
                <strong>ID Orden:</strong> {orden.idOrden}
              </p>
              <p>
                <strong>Nombre:</strong> {orden.nombre_completo}
              </p>
              <p>
                <strong>Dirección:</strong> {orden.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {orden.telefono}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {orden.correo_electronico}
              </p>
              <p>
                <strong>Fecha Entrega:</strong> {orden.fecha_entrega}
              </p>
              <p>
                <strong>Total:</strong> Q{orden.total_orden}
              </p>
              <p>
                <strong>Estado:</strong> {estados[orden.estados_idestados]} 
              </p>
            </div>
            <div className="orden-actions">
              {orden.estados_idestados === 3 && (
                <button onClick={() => handleEliminar(orden.idOrden)}>
                  Eliminar
                </button>
              )}
              {userRole === "1" && (
                <button onClick={() => handleEntregar(orden.idOrden)}>
                  Entregar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listapedidos;
