import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/NavBar.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const Navbar = () => {
  const [categoriasActivas, setCategoriasActivas] = useState([]);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("Rol");

  const ocultarNavbar = ["/", "/login",  "/Nuevo"].includes(
    location.pathname
  );

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/CategoriaProductos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const categoriasFiltradas = response.data
          .filter((categoria) => categoria.estados_idestados === 1)
          .map((categoria) => ({
            id: categoria.idCategoriaProductos,
            nombre: categoria.nombre,
          }));
        setCategoriasActivas(categoriasFiltradas);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    obtenerCategorias();
  }, [token]);

  useEffect(() => {
    const actualizarCantidadCarrito = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const totalProductos = carrito.reduce(
        (acc, producto) => acc + producto.cantidad,
        0
      );
      setCantidadCarrito(totalProductos);
    };

    actualizarCantidadCarrito();

    const handleStorageChange = () => actualizarCantidadCarrito();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/Producto/${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/ResultadosBusqueda", {
          state: { productos: response.data },
        });
      } catch (error) {
        console.error("Error al buscar productos:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      {!ocultarNavbar && (
        <>
          <div className="left-menu">
            <a href="#" onClick={() => navigate("/Productos")}>
              <HomeIcon /> Inicio
            </a>
            <div
              className="categorias-menu"
              onMouseEnter={() => setMostrarCategorias(true)}
              onMouseLeave={() => setMostrarCategorias(false)}
            >
              <a href="#">Categorías</a>
              {mostrarCategorias && (
                <ul className="categorias-dropdown">
                  {categoriasActivas.map((categoria) => (
                    <li
                      key={categoria.id}
                      onClick={() => navigate(`/CategoriaProducto/${categoria.id}`)}
                    >
                      {categoria.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a href="#" onClick={() => navigate("/ListaTodosProductos")}>
              Productos
            </a>
          </div>
          <div className="search-form">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto..."
              />
              <button type="submit">Buscar</button>
            </form>
            <div className="acciones">
              <button onClick={() => navigate("/ListapedidosActivos")}>
                Pedidos
              </button>
            </div>
            {rolUsuario === "1" && (
              <div className="acciones">
                <button onClick={() => navigate("/Datos")}>Administracion</button>
              </div>
            )}
          </div>
          <div className="right-menu">
            <a href="#" onClick={() => navigate("/Carrito")}>
              <ShoppingCartIcon />
              <span className="carrito-badge">{cantidadCarrito}</span>
            </a>

            <a
              href="#"
              onClick={() =>
                navigate(`/ActualizarUsuario/${localStorage.getItem("id")}`)
              }
            >
              <AccountBoxIcon /> Perfil
            </a>

            <a href="#" onClick={handleCerrarSesion}>
              <LoginIcon /> Cerrar Sesión
            </a>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
