import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [cargar, setCargar] = useState(true);
  const rolUsuario = localStorage.getItem("Rol");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/Productos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productoseparado = response.data.map((producto) => ({
        id: producto.idProdcutos,
        nombre: producto.nombre,
        marca: producto.marca,
        precio: producto.precio,
        stock: producto.stock,
        estado: obtenerEstado(producto.estados_idestados),
        foto: producto.foto,
      }));

      setProductos(productoseparado);

      const cantidadesIniciales = productoseparado.reduce((acc, producto) => {
        acc[producto.id] = 1;
        return acc;
      }, {});
      setCantidades(cantidadesIniciales);

      setCargar(false);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setCargar(false);
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

  const handleActualizar = async (id) => {
    navigate(`/actualizar/${id}`);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/ProductosDel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Producto eliminado exitosamente");
      obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al eliminar el producto: " + error.message);
    }
  };

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: nuevaCantidad,
    }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id];
    if (cantidad > producto.stock) {
      alert(
        `No puedes agregar más de ${producto.stock} unidad(es) de "${producto.nombre}".`
      );
      return;
    }

    const itemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      cantidad: cantidad,
      precio: producto.precio,
    };

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push(itemCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(
      `Se agregó ${cantidad} unidad(es) de "${producto.nombre}" al carrito`
    );
  };

  if (cargar) return <div className="loading">Cargando productos...</div>;

  const productosActivos = productos.filter(
    (producto) => producto.estado === "Activo"
  );

  return (
    <div className="productos-container">
      <h1>Productos Activos</h1>
      <div className="productos-list">
        {productosActivos.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>
              <strong>Marca:</strong> {producto.marca}
            </p>
            <p>
              <strong>Precio:</strong> Q{producto.precio}
            </p>
            <p>
              <strong>Stock Disponible:</strong> {producto.stock}
            </p>
            <p>
              <strong>Estado:</strong> {producto.estado}
            </p>

            {producto.foto && (
              <img
                src={producto.foto}
                alt={producto.nombre}
                className="producto-img"
              />
            )}

            <div className="acciones">
              <label>
                <strong>Cantidad:</strong>
                <input
                  type="number"
                  min="1"
                  value={cantidades[producto.id]}
                  onChange={(e) =>
                    handleCantidadChange(producto.id, parseInt(e.target.value))
                  }
                />
              </label>

              <button onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </button>
            </div>

            {rolUsuario === "1" && (
              <div className="acciones">
                <button onClick={() => handleActualizar(producto.id)}>
                  Actualizar
                </button>
                <button onClick={() => handleEliminar(producto.id)}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
