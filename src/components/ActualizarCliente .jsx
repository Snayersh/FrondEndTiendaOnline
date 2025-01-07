import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ActualizarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const [cliente, setCliente] = useState({
    razon_social: "",
    nombre_comercial: "",
    direccion_entrega: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/Clientes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCliente(response.data);
        setValue("razon_social", response.data.razon_social);
        setValue("nombre_comercial", response.data.nombre_comercial);
        setValue("direccion_entrega", response.data.direccion_entrega);
        setValue("telefono", response.data.telefono);
        setValue("email", response.data.email);
      } catch (error) {
        console.error("Error al obtener el cliente:", error);
        alert("Error al obtener los datos del cliente.");
      }
    };

    obtenerCliente();
  }, [id, token, setValue]);

  const handleActualizarCliente = async (data) => {
    const {
      razon_social,
      nombre_comercial,
      direccion_entrega,
      telefono,
      email,
    } = data;
    const updatedData = {
      razon_social,
      nombre_comercial,
      direccion_entrega,
      telefono,
      email,
    };

    try {
      await axios.put(`http://localhost:3000/api/Clientes/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cliente actualizado con éxito");
      navigate(`/ActualizarCliente/${id}`);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      alert("Error al actualizar el cliente: " + error.message);
    }
  };

  if (!cliente.razon_social || !cliente.nombre_comercial)
    return <div>Cargando datos...</div>;

  return (
    <div>
      <h1>Actualizar Cliente</h1>
      <form onSubmit={handleSubmit(handleActualizarCliente)}>
        <div>
          <label>Razón Social</label>
          <input
            type="text"
            {...register("razon_social")}
            defaultValue={cliente.razon_social}
          />
          {errors.razon_social && <p>{errors.razon_social.message}</p>}
        </div>
        <div>
          <label>Nombre Comercial</label>
          <input
            type="text"
            {...register("nombre_comercial")}
            defaultValue={cliente.nombre_comercial}
          />
          {errors.nombre_comercial && <p>{errors.nombre_comercial.message}</p>}
        </div>
        <div>
          <label>Dirección de Entrega</label>
          <input
            type="text"
            {...register("direccion_entrega")}
            defaultValue={cliente.direccion_entrega}
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            {...register("telefono")}
            defaultValue={cliente.telefono}
          />
          {errors.telefono && <p>{errors.telefono.message}</p>}
        </div>
        <div>
          <label>Correo Electrónico</label>
          <input
            type="email"
            {...register("email")}
            defaultValue={cliente.email}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default ActualizarCliente;
