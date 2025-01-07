import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const EliminarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validacionSchema = yup.object().shape({
    motivo: yup
      .string()
      .min(10, "El motivo debe tener al menos 10 caracteres.")
      .required("El motivo es obligatorio."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const onSubmit = async (data) => {
    const { motivo } = data;
    try {
      await axios.put(
        `http://localhost:3000/api/usuarioDel/${id}`,
        { motivo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Usuario eliminado con éxito");
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al eliminar un usuario:", error);
      alert("Error al eliminar un usuario: " + error.message);
    }
  };

  return (
    <div>
      <h1>Eliminar Usuario</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <thead>
            <tr>
              <th>Motivo de eliminación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <textarea
                  {...register("motivo")}
                  placeholder="Escribe el motivo de la eliminación..."
                  rows="4"
                  cols="50"
                />
                {errors.motivo && <p>{errors.motivo.message}</p>}
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Eliminar Usuario</button>
      </form>
    </div>
  );
};

export default EliminarUsuario;
