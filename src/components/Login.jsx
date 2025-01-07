import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const validacionSchema = yup.object().shape({
    correo_electronico: yup
      .string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    password: yup
      .string()
      .min(6, "La contraseña es muy corta")
      .required("La contraseña es obligatoria"),
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
        "http://localhost:3000/api/login/",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const resultado = response.data;

      console.log(resultado);

      localStorage.setItem("token", resultado.token);
      localStorage.setItem("Rol", resultado.rol_idrol);
      localStorage.setItem("id", resultado.idusuarios);
      localStorage.setItem("nombre_completo", resultado.nombre_completo);
      localStorage.setItem("direccion", resultado.direccion);
      localStorage.setItem("telefono", resultado.telefono);
      localStorage.setItem("correo_electronico", resultado.correo_electronico);

      if (resultado.rol_idrol === 1) {
        navigate("/Pedidos"); // Rol 1: operador
      } else if (resultado.rol_idrol === 2) {
        navigate("/Productos"); // Rol 2: cliente
      } else {
        alert("Cuenta no Disponible");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="correo_electronico">Correo Electrónico</label>
          <input
            type="correo_electronico"
            id="correo_electronico"
            {...register("correo_electronico")}
            placeholder="Ingrese el correo electrónico"
          />
          <p className="error">{errors.correo_electronico?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder="Ingrese su contraseña"
          />
          <p className="error">{errors.password?.message}</p>
        </div>
        <button type="submit">Iniciar Sesión</button>
        <button type="button" onClick={() => navigate("/Nuevo")}>
          Nuevo Usuario
        </button>
      </form>
    </div>
  );
};

export default Login;
