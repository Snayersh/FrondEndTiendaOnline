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
  const [categorias, setCategorias] = useState([]);
  const [foto, setFoto] = useState(null);

  const validacionSchema = yup.object().shape({
    CategoriaProductos_idCategoriaProducto: yup.number().required("La categoría es obligatoria"),
    nombre: yup.string(),
    marca: yup.string(),
    codigo: yup.string(),
    stock: yup.number(),
    estados_idestados: yup.number(),
    precio: yup.number().min(1, "El precio debe ser mayor a 0"),
    foto: yup.mixed(), // Para manejar archivos
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
          `http://localhost:3000/api/Producto/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducto(response.data);
        Object.keys(response.data).forEach((key) => {
          if (key !== 'foto') {  // No establecer foto con setValue
            setValue(key, response.data[key]);
          }
        });
        if (response.data.foto) {
          setFoto(response.data.foto);
        }
      } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
        alert("Error al cargar el producto.");
        navigate("/Productos");
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/CategoriaProductos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const categoriasFiltradas = response.data.filter(
          (categoria) => categoria.estados_idestados === 1
        );
        setCategorias(categoriasFiltradas);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchProducto();
    fetchCategorias();
  }, [id, setValue, navigate, token]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {  // Validamos que no supere los 10MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result.split(",")[1]);  // Guardamos solo la parte base64
      };
      reader.readAsDataURL(file);
    } else {
      alert("La imagen excede el tamaño máximo permitido de 10MB.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const idUsuario = localStorage.getItem("id");

      const dataConUsuario = idUsuario
        ? { ...data, idusuarios: idUsuario, foto: foto }
        : { ...data, foto: foto };

      await axios.put(
        `http://localhost:3000/api/Productos/${id}`,
        dataConUsuario,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Producto actualizado exitosamente");
      navigate("/Productos");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto: " + error.message);
    }
  };

  if (!producto || categorias.length === 0) return <div>Cargando datos...</div>;

  return (
    <div className="producto-container">
      <h1>Actualizar Producto</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Categoría:</label>
          <select
            {...register("CategoriaProductos_idCategoriaProducto")}
            defaultValue={producto.CategoriaProductos_idCategoriaProducto}
          >
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
          {foto && <img src={`data:image/jpeg;base64,${foto}`} alt="Producto" />}
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
          />
          {errors.foto && <p>{errors.foto.message}</p>}
        </div>
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default ActualizarProducto;
