import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProcesarPedido = () => {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );
  const navigate = useNavigate();

  const calcularTotal = () => {
    return carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };

  const procesarPedido = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de proceder.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Por favor, inicia sesión para procesar tu pedido.");
      navigate("/login");
      return;
    }

    const nombre_completo = localStorage.getItem("nombre_completo");
    const direccion = localStorage.getItem("direccion");
    const telefono = localStorage.getItem("telefono");
    const correo_electronico = localStorage.getItem("correo_electronico");
    const usuarios_idusuarios = localStorage.getItem("id");

    if (!nombre_completo || !direccion || !telefono || !correo_electronico) {
      alert("Información del usuario incompleta. Verifica tu cuenta.");
      navigate("/Perfil");
      return;
    }

    const totalOrden = calcularTotal();
    const detalles = carrito.map((producto) => ({
      idProducto: producto.id,
      cantidad: producto.cantidad,
      precio: producto.precio,
    }));

    const orden = {
      usuarios_idusuarios,
      estados_idestados: 3, //Estado PEndiente
      nombre_completo,
      direccion,
      telefono,
      correo_electronico,
      fecha_entrega: new Date().toISOString(),
      total_orden: totalOrden,
      detalles,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/Orden",
        orden,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pedido procesado con éxito.");
      localStorage.removeItem("carrito");
      setCarrito([]);
      navigate("/Productos");
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un problema al procesar el pedido.");
    }
  };

  return (
    <div>
      <h1>Procesar Pedido</h1>
      <button onClick={procesarPedido}>Procesar Pedido</button>
    </div>
  );
};

export default ProcesarPedido;
