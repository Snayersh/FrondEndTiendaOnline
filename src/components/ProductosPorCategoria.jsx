import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ListaProductos.css";

const ProductosPorCategoria = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [cargar, setCargar] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerCategoriaConProductos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/CategoriayProductos/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCategoria(response.data.categoria);
        const productoseparado = response.data.productos.map((producto) => ({
          id: producto.idProdcutos,
          nombre: producto.nombre,
          marca: producto.marca,
          precio: producto.precio,
          stock: producto.stock,
          estado: obtenerEstado(producto.estados_idestados),
          foto: producto.foto ? `data:image/jpeg;base64,${producto.foto}` : null, // Conversión a base64
        }));

        setProductos(productoseparado);

        const cantidadesIniciales = productoseparado.reduce((acc, producto) => {
          acc[producto.id] = 1;
          return acc;
        }, {});
        setCantidades(cantidadesIniciales);

        setCargar(false);
      } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        setCargar(false);
      }
    };

    obtenerCategoriaConProductos();
  }, [id]);

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

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: nuevaCantidad,
    }));
  };

  if (cargar) return <div className="loading">Cargando productos...</div>;

  return (
    <div className="productos-container">
      {categoria && <h1>Productos de la Categoría: {categoria.nombre}</h1>}
      <div className="productos-list">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div className="producto-card" key={producto.id}>
              <h2>{producto.nombre}</h2>
              <p>
                <strong>Marca:</strong> {producto.marca}
              </p>
              <p>
                <strong>Precio:</strong> Q{producto.precio}
              </p>
              <p>
                <strong>Stock Disponible: </strong>
                {producto.stock}
              </p>
              <p>
                <strong>Estado:</strong> {producto.estado}
              </p>

              {/* Mostrar la foto, si existe */}
              {producto.foto ? (
                <img
                  src={producto.foto} // Usando base64 directamente
                  alt={producto.nombre}
                  className="producto-img"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/150" // Imagen por defecto si no existe
                  alt="Producto no disponible"
                  className="producto-img"
                />
              )}

              <div className="acciones">
                {producto.estado === "Activo" && (
                  <>
                    <label>
                      <strong>Cantidad:</strong>
                      <input
                        type="number"
                        min="1"
                        value={cantidades[producto.id]}
                        onChange={(e) =>
                          handleCantidadChange(
                            producto.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </label>

                    <button onClick={() => agregarAlCarrito(producto)}>
                      Agregar al carrito
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron productos para esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default ProductosPorCategoria;
