import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Productos.css";

const NuevoProducto = () => {
  const navigate = useNavigate();
  const [foto, setFoto] = useState("");
  const token = localStorage.getItem("token");

  const validacionSchema = yup.object().shape({
    CategoriaProductos_idCategoriaProductos: yup
      .number()
      .required("La categoría es obligatoria"),
    nombre: yup.string().required("El nombre del producto es obligatorio"),
    marca: yup.string().required("La marca del producto es obligatoria"),
    codigo: yup.string().required("El código es obligatorio"),
    stock: yup.number().required("El stock es obligatorio"),
    estados_idestados: yup
      .number()
      .required("El estado del producto es obligatorio"),
    precio: yup
      .number()
      .min(1, "El precio debe ser mayor a 0")
      .required("El precio es obligatorio"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setFoto(base64);
        setValue("foto", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const idUsuario = localStorage.getItem("id");
      const idclientes = localStorage.getItem("id");
      if (!idUsuario || !idclientes) {
        alert("No se pudo identificar al usuario activo.");
        return;
      }

      const dataConUsuario = { ...data, idusuarios: idUsuario, idclientes };

      await axios.post("http://localhost:3000/api/Productos", dataConUsuario, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Producto creado exitosamente");
      navigate("/Productos");
    } catch (error) {
      console.error("Error al crear un nuevo producto:", error);
      alert("Error al crear un nuevo producto: " + error.message);
    }
  };

  return (
    <div className="producto-container">
      <h1>Crear Nuevo Producto</h1>
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
          <label>Foto:</label>
          <input type="file" accept="image/*" onChange={handleFotoChange} />
          {errors.foto && <p>{errors.foto.message}</p>}
        </div>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default NuevoProducto;
