import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Productos.css";

const ActualizarProducto = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  const validacionSchema = yup.object().shape({
    CategoriaProductos_idCategoriaProductos: yup.number(),
    nombre: yup.string(),
    marca: yup.string(),
    codigo: yup.string(),
    stock: yup.number(),
    estados_idestados: yup.number(),
    precio: yup.number().min(1, "El precio debe ser mayor a 0"),
    foto: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/Productos/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducto(response.data);
        Object.keys(response.data).forEach((key) => {
          setValue(key, response.data[key]);
        });
      } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
        alert("Error al cargar el producto.");
        navigate("/Productos");
      }
    };

    fetchProducto();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      const idUsuario = localStorage.getItem("id");

      const dataConUsuario = idUsuario
        ? { ...data, idusuarios: idUsuario }
        : data;

      await axios.put(
        `http://localhost:3000/api/Productos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
        dataConUsuario,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Producto actualizado exitosamente");
      navigate("/Productos");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto: " + error.message);
    }
  };

  if (!producto) return <div>Cargando datos del producto...</div>;

  return (
    <div className="producto-container">
      <h1>Actualizar Producto</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Categoría:</label>
          <input
            type="number"
            {...register("CategoriaProductos_idCategoriaProductos")}
          />
          {errors.CategoriaProductos_idCategoriaProductos && (
            <p>{errors.CategoriaProductos_idCategoriaProductos.message}</p>
          )}
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" {...register("nombre")} />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>
        <div>
          <label>Marca:</label>
          <input type="text" {...register("marca")} />
          {errors.marca && <p>{errors.marca.message}</p>}
        </div>
        <div>
          <label>Código:</label>
          <input type="text" {...register("codigo")} />
          {errors.codigo && <p>{errors.codigo.message}</p>}
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" {...register("stock")} />
          {errors.stock && <p>{errors.stock.message}</p>}
        </div>
        <div>
          <label>Estado:</label>
          <select {...register("estados_idestados")}>
            <option value={1}>Activo</option>
            <option value={2}>Inactivo</option>
            <option value={3}>Pendiente</option>
            <option value={4}>En tránsito</option>
            <option value={5}>Entregado</option>
          </select>
          {errors.estados_idestados && (
            <p>{errors.estados_idestados.message}</p>
          )}
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" {...register("precio")} />
          {errors.precio && <p>{errors.precio.message}</p>}
        </div>
        <div>
          <label>Foto (Base64):</label>
          <input type="text" {...register("foto")} />
          {errors.foto && <p>{errors.foto.message}</p>}
        </div>
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default ActualizarProducto;
