import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ordenes.css";
const Listapedidos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Por favor, inicia sesión para continuar.");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/Orden", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = localStorage.getItem("id"); 
        const ordenesFiltradas = response.data.mensaje.filter(
          (orden) =>
            orden.estados_idestados === 1 && orden.usuarios_idusuarios === userId
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

  const handleEliminar = (idOrden) => {
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
            </div>
            <div className="orden-actions">
              <button onClick={() => handleEliminar(orden.idOrden)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listapedidos;
