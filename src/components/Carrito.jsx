import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/carrito.css";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const carritoActualizado = carrito.map((producto) =>
      producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
    );

    setCarrito(carritoActualizado);
    localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
  };

  const eliminarProducto = (id) => {
    const carritoActualizado = carrito.filter((producto) => producto.id !== id);

    setCarrito(carritoActualizado);
    localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
  };

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
      alert("Informacion del usuario incompleta. Verifica tu cuenta.");
      navigate("/ActualizarUsuario");
      return;
    }

    const totalOrden = calcularTotal();
    const detalles = carrito.map((producto) => ({
      Productos_idProductos: producto.id,
      cantidad: producto.cantidad,
      precio: producto.precio,
    }));

    const orden = {
      usuarios_idusuarios,
      estados_idestados: 3,
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

  if (carrito.length === 0)
    return <div className="carrito-vacio">Tu carrito está vacío.</div>;

  return (
    <div className="carrito-container">
      <h1>Tu Carrito</h1>
      <div className="carrito-lista">
        {carrito.map((producto) => (
          <div className="carrito-item" key={producto.id}>
            <div className="carrito-info">
              <h2>{producto.nombre}</h2>
              <p>
                <strong>Precio:</strong> Q{producto.precio}
              </p>
              <p>
                <strong>Cantidad:</strong>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) =>
                    actualizarCantidad(producto.id, parseInt(e.target.value))
                  }
                  min="1"
                />
              </p>
              <button onClick={() => eliminarProducto(producto.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="carrito-total">
        <h2>Total: Q{calcularTotal().toFixed(2)}</h2>
        <button onClick={procesarPedido}>Procesar Pedido</button>
      </div>
    </div>
  );
};

export default Carrito;
