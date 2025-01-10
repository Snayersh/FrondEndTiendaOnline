import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ListaProductos.css";

const ResultadosBusqueda = () => {
  const location = useLocation();
  const obtenerEstado = (estados_idestados) => {
    const estado = {
      1: "Activo",
      2: "Inactivo",
      3: "Pendiente",
      4: "En tránsito",
      5: "Entregado",
    };
    return estado[estados_idestados] || "Desconocido";
  };

  const productosBuscados = (location.state?.productos || []).map((producto) => ({
    ...producto,
    estado: obtenerEstado(producto.estados_idestados),
  }));

  const [productos, setProductos] = useState(productosBuscados);
  const [stockes, setStockes] = useState({});

  useEffect(() => {
    // Se ejecutará solo una vez cuando el componente se monte
    const stockesIniciales = productosBuscados.reduce((acc, producto) => {
      acc[producto.id] = 1; // Establece 1 como valor inicial
      return acc;
    }, {});
    setStockes(stockesIniciales); // Establece el estado de los stocks
  }, []); // Dependencia vacía para ejecutarse solo una vez al montar el componente

  const handleStockChange = (id, nuevoStock) => {
    if (nuevoStock >= 1) {
      setStockes((prevStockes) => ({
        ...prevStockes,
        [id]: nuevoStock,
      }));
    }
  };

  const agregarAlCarrito = (producto) => {
    const stock = stockes[producto.id]; // Obtiene el stock del estado
    if (stock > producto.stock) {
      alert(
        `No puedes agregar más de ${producto.stock} unidad(es) de "${producto.nombre}".`
      );
      return;
    }

    const itemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      stock: stock,
      precio: producto.precio,
    };

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      carrito[index].stock += stock;
    } else {
      carrito.push(itemCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(
      `Se agregó ${stock} unidad(es) de "${producto.nombre}" al carrito`
    );
  };

  if (productos.length === 0) {
    return <div>No se encontraron productos.</div>;
  }

  return (
    <div className="productos-container">
      <h1>Resultados de Búsqueda</h1>
      <div className="productos-list">
        {productos.map((producto, index) => (
          <div className="producto-card" key={producto.id || `producto-${index}`}>
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
              <strong>Estado:</strong> {producto.estado || "No especificado"}
            </p>
            {producto.foto && (
              <img
                src={producto.foto}
                alt={producto.nombre}
                className="producto-img"
              />
            )}
            {producto.estado === "Activo" && (
              <div className="acciones">
                <label>
                  <strong>stock:</strong>
                  <input
                    type="number"
                    min="1"
                    max={producto.stock}
                    value={stockes[producto.id] || 1} // Asegura un valor predeterminado
                    onChange={(e) =>
                      handleStockChange(producto.id, parseInt(e.target.value))
                    }
                  />
                </label>
                <button onClick={() => agregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultadosBusqueda;
