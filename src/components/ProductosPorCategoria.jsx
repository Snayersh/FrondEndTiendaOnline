import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductosPorCategoria = () => {
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState([]);
  const [cargar, setCargar] = useState(true);

  useEffect(() => {
    const obtenerProductosPorCategoria = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/ProductosPorCategoria/${categoriaId}`
        );
        setProductos(response.data);
        setCargar(false);
      } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        setCargar(false);
      }
    };

    obtenerProductosPorCategoria();
  }, [categoriaId]);

  if (cargar) return <div>Cargando productos...</div>;

  return (
    <div>
      <h1>Productos de la Categoría</h1>
      <div>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id}>
              <h2>{producto.nombre}</h2>
              <p>{producto.marca}</p>
              <p>{producto.precio}</p>
              <p>{producto.stock}</p>
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
