import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/nuevousuario.css";

const NuevoUsuario = () => {
  const navigate = useNavigate();

  const validacionSchema = yup.object().shape({
    rol_idrol: yup.number().required("El Rol es obligatorio"),
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
    fecha_nacimiento: yup
      .date()
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "Debes tener al menos 18 años"
      )
      .required("La fecha de nacimiento es obligatoria"),
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionSchema),
  });

  const opcionesRol = [
    { text: "Operador", valor: 1 },
    { text: "Cliente", valor: 2 },
  ];

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/usuario",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      const resultado = response.data;
      console.log(resultado);
      alert("Usuario creado exitosamente");
      navigate("/");
    } catch (error) {
      console.error("Error al crear un nuevo usuario:", error);
      alert("Error al crear un nuevo usuario: " + error.message);
    }
  };

  return (
    <div className="Nuevo-container">
      <h2>Nuevo Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="rol_idrol">Seleccione un rol: </label>
          <select id="rol_idrol" {...register("rol_idrol")}>
            <option value="">Seleccione</option>
            {opcionesRol.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.text}
              </option>
            ))}
          </select>
          <p className="error">{errors.rol_idrol?.message}</p>
        </div>
        <div>
          <label htmlFor="nombre_completo">nombre_completo:</label>
          <input
            type="nombre_completo"
            id="nombre_completo"
            {...register("nombre_completo")}
            placeholder="Coloque su nombre completo"
          />
          <p className="error">{errors.nombre_completo?.message}</p>
        </div>

        <div>
          <label htmlFor="correo_electronico">Correo Electrónico:</label>
          <input
            type="email"
            id="correo_electronico"
            {...register("correo_electronico")}
            placeholder="Ingrese el correo electrónico"
          />
          <p className="error">{errors.correo_electronico?.message}</p>
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder="Ingrese su contraseña"
          />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            {...register("telefono")}
            placeholder="Ingrese su teléfono"
          />
          <p className="error">{errors.telefono?.message}</p>
        </div>

        <div>
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fecha_nacimiento"
            {...register("fecha_nacimiento")}
          />
          <p className="error">{errors.fecha_nacimiento?.message}</p>
        </div>

        <div>
          <label htmlFor="clientes_idclientes">Codigo Cliente</label>
          <input
            type="text"
            id="clientes_idclientes"
            {...register("clientes_idclientes")}
            placeholder="Ingrese el código cliente (si aplica)"
          />
          <p className="error">{errors.clientes_idclientes?.message}</p>
        </div>

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default NuevoUsuario;
