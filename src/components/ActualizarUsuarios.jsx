import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ActualizarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const validacionSchema = yup.object().shape({
    correo_electronico: yup
      .string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    nombre_completo: yup.string().required("El nombre es obligatorio"),
    password: yup
      .string()
      .min(6, "La contraseña es muy corta")
      .required("La contraseña es requerida"),
    telefono: yup
      .string()
      .matches(/^\d{8}$/, "Número no válido, necesita 8 dígitos")
      .required("El número de teléfono es obligatorio"),
    clientes_idclientes: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value
      )
      .notRequired(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const [usuario, setUsuario] = useState({
    nombre_completo: "",
    correo_electronico: "",
    password: "",
    telefono: "",
    clientes_idclientes: "",
  });

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/usuario/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsuario(response.data);
        setValue("nombre_completo", response.data.nombre_completo);
        setValue("correo_electronico", response.data.correo_electronico);
        setValue("telefono", response.data.telefono);
        setValue("clientes_idclientes", response.data.clientes_idclientes);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        alert("Error al obtener los datos del usuario.");
      }
    };

    obtenerUsuario();
  }, [id, token, setValue]);

  const handleActualizarUsuario = async (data) => {
    const {
      nombre_completo,
      correo_electronico,
      telefono,
      clientes_idclientes,
    } = data;
    const updatedData = {
      nombre_completo,
      correo_electronico,
      telefono,
      clientes_idclientes,
    };

    try {
      await axios.put(`http://localhost:3000/api/usuario/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Perfil actualizado con éxito");
      navigate(`/ActualizarUsuario/${id}`);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Error al actualizar el perfil: " + error.message);
    }
  };

  if (!usuario.nombre_completo || !usuario.correo_electronico)
    return <div>Cargando datos...</div>;

  return (
    <div>
      <h1>Actualizar Perfil</h1>
      <form onSubmit={handleSubmit(handleActualizarUsuario)}>
        <div>
          <label>Nombre Completo</label>
          <input
            type="text"
            {...register("nombre_completo")}
            defaultValue={usuario.nombre_completo}
          />
          {errors.nombre_completo && <p>{errors.nombre_completo.message}</p>}
        </div>
        <div>
          <label>Correo Electrónico</label>
          <input
            type="email"
            {...register("correo_electronico")}
            defaultValue={usuario.correo_electronico}
          />
          {errors.correo_electronico && (
            <p>{errors.correo_electronico.message}</p>
          )}
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            {...register("password")}
            defaultValue={usuario.password}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            {...register("telefono")}
            defaultValue={usuario.telefono}
          />
          {errors.telefono && <p>{errors.telefono.message}</p>}
        </div>
        <div>
          <label>ID Cliente</label>
          <input
            type="number"
            {...register("clientes_idclientes")}
            defaultValue={usuario.clientes_idclientes}
          />
          {errors.clientes_idclientes && (
            <p>{errors.clientes_idclientes.message}</p>
          )}
        </div>
        <button type="submit">Actualizar</button>
      </form>
      <button type="button" onClick={() => navigate(`/EliminarUsuario/${id}`)}>
        Eliminar Cuenta
      </button>
    </div>
  );
};

export default ActualizarUsuario;
