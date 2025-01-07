import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/nuevocliente.css";

const NuevoCliente = () => {
  const navigate = useNavigate();

  const validacionSchema = yup.object().shape({
    razon_social: yup.string().required("La razón social es obligatoria"),
    nombre_comercial: yup
      .string()
      .required("El nombre comercial es obligatorio"),
    direccion_entrega: yup.string().nullable().notRequired(),
    telefono: yup
      .string()
      .matches(/^\d{8}$/, "Número no válido, necesita 8 dígitos")
      .required("El número de teléfono es obligatorio"),
    email: yup
      .string()
      .email("El correo no es válido")
      .required("El correo electrónico es obligatorio"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/Clientes",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      const resultado = response.data;
      console.log(resultado);
      alert("Cliente creado exitosamente");
      navigate("/Datos");
    } catch (error) {
      console.error("Error al crear un nuevo cliente:", error);
      alert("Error al crear un nuevo cliente: " + error.message);
    }
  };

  return (
    <div className="Nuevo-container">
      <h2>Nuevo Cliente</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="razon_social">Razón Social:</label>
          <input
            type="text"
            id="razon_social"
            {...register("razon_social")}
            placeholder="Ingrese la razón social"
          />
          <p className="error">{errors.razon_social?.message}</p>
        </div>

        <div>
          <label htmlFor="nombre_comercial">Nombre Comercial:</label>
          <input
            type="text"
            id="nombre_comercial"
            {...register("nombre_comercial")}
            placeholder="Ingrese el nombre comercial"
          />
          <p className="error">{errors.nombre_comercial?.message}</p>
        </div>

        <div>
          <label htmlFor="direccion_entrega">Dirección de Entrega:</label>
          <input
            type="text"
            id="direccion_entrega"
            {...register("direccion_entrega")}
            placeholder="Ingrese la dirección de entrega (opcional)"
          />
        </div>

        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            {...register("telefono")}
            placeholder="Ingrese el teléfono"
          />
          <p className="error">{errors.telefono?.message}</p>
        </div>

        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder="Ingrese el correo electrónico"
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <button type="submit">Crear Cliente</button>
      </form>
    </div>
  );
};

export default NuevoCliente;
