import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegistrarCategoria.css";

const RegistrarCategoria = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validacionSchema = yup.object().shape({
    nombre: yup.string().required("El nombre de la categoría es obligatorio"),
    estados_idestados: yup
      .number()
      .required("El estado de la categoría es obligatorio"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const onSubmit = async (data) => {
    try {
      const idUsuario = localStorage.getItem("id");
      if (!idUsuario) {
        alert("No se pudo identificar al usuario activo.");
        return;
      }

      const dataConUsuario = { ...data, usuarios_idusuarios: idUsuario };

      await axios.post(
        "http://localhost:3000/api/CategoriaProductos",
        dataConUsuario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Categoría registrada exitosamente");
      navigate("/Productos");
    } catch (error) {
      console.error("Error al registrar la categoría:", error);
      alert("Error al registrar la categoría: " + error.message);
    }
  };

  return (
    <div className="categoria-container">
      <h1>Registrar Nueva Categoría</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre:</label>
          <input type="text" {...register("nombre")} />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>
        <div>
          <label>Estado:</label>
          <select {...register("estados_idestados")}>
            <option value={1}>Activo</option>
            <option value={2}>Inactivo</option>
            <option value={3}>Pendiente</option>
          </select>
          {errors.estados_idestados && (
            <p>{errors.estados_idestados.message}</p>
          )}
        </div>
        <button type="submit">Registrar Categoría</button>
      </form>
    </div>
  );
};

export default RegistrarCategoria;
