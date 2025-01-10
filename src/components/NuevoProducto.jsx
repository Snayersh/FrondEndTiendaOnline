import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Productos.css";

const NuevoProducto = () => {
  const navigate = useNavigate();
  const [foto, setFoto] = useState("");
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");

  const validacionSchema = yup.object().shape({
    CategoriaProductos_idCategoriaProducto: yup
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
    .positive("El precio debe ser mayor que 0")
    .required("El precio es obligatorio")
    .test("maxDecimals", "El precio no puede tener más de dos decimales", (value) =>
      /^\d+(\.\d{1,2})?$/.test(value)
  
  
      ),
    foto: yup.string(),  // No es obligatorio subir foto
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
      if (file.size > 10 * 1024 * 1024) { 
        alert("La imagen supera el tamaño máximo permitido de 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setFoto(base64);
        setValue("foto", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/CategoriaProductos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriasFiltradas = response.data.filter(
          (categoria) => categoria.estados_idestados === 1
        );
        setCategorias(categoriasFiltradas);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    obtenerCategorias();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const idUsuario = localStorage.getItem("id");
      if (!idUsuario) {
        alert("No se pudo identificar al usuario activo.");
        return;
      }

      const dataConUsuario = {
        ...data,
        usuario_idusuario: idUsuario,
      };

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
          <select {...register("CategoriaProductos_idCategoriaProducto")}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoriaProductos} value={categoria.idCategoriaProductos}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.CategoriaProductos_idCategoriaProducto && (
            <p>{errors.CategoriaProductos_idCategoriaProducto.message}</p>
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
            <option value={3}>Bodega</option>
            <option value={4}>En Transito</option>
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
