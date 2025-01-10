import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Productos from "./components/productos";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import NuevoUsuario from "./components/NuevoUsuario";
import ValidarCuenta from "./components/Validacion";
import ListaUsuarios from "./components/ListaUsuarios";
import Proteccion from "./components/Proteccion";
import Listatodosprodutos from "./components/ListaProductos";
import ActualizarProducto from "./components/ActualizarProductos";
import ActualizarUsuario from "./components/ActualizarUsuarios";
import Carrito from "./components/Carrito";
import Listapedidos from "./components/Listapedidos";
import NuevoProducto from "./components/NuevoProducto";
import ProductosPorCategoria from "./components/ProductosPorCategoria";
import Datos from "./components/Datos";
import RegistrarCategoria from "./components/NuevaCategoria";
import ListaClientes from "./components/ListaClientes";
import NuevoCliente from "./components/NuevoCliente";
import ActualizarCliente from "./components/ActualizarCliente ";
import EliminarUsuario from "./components/EliminarUsuario";
import ListapedidosActivos from './components/ListaPedidosActivos'
import ResultadosBusqueda from './components/ResultadosBusqueda'
import CategoriaProducto from './components/ProductosPorCategoria'

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        {/* Rutas Publicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Validar" element={<ValidarCuenta />} />
        <Route path="/Nuevo" element={<NuevoUsuario />} />
        <Route path="/NuevoCliente" element={<NuevoCliente />} />

        {/* Rutas protegidas */}

        <Route
          path="/Usuarios"
          element={
            <Proteccion roles={["1"]}>
              <ListaUsuarios />{" "}
            </Proteccion>
          }
        />
        <Route
          path="/Productos"
          element={
            <Proteccion roles={["1", "2"]}>
              <Productos />
            </Proteccion>
          }
        />
        <Route
          path="/ListaTodosProductos"
          element={
            <Proteccion roles={["1", "2"]}>
              <Listatodosprodutos />
            </Proteccion>
          }
        />
        <Route
          path="/ActualizarProducto/:id"
          element={
            <Proteccion roles={["1"]}>
              <ActualizarProducto />
            </Proteccion>
          }
        />
        <Route
          path="/ActualizarUsuario/:id"
          element={
            <Proteccion roles={["1", "2"]}>
              <ActualizarUsuario />
            </Proteccion>
          }
        />
        <Route
          path="/Carrito"
          element={
            <Proteccion roles={["1", "2"]}>
              <Carrito />
            </Proteccion>
          }
        />
        <Route
          path="/Pedidos"
          element={
            <Proteccion roles={["1"]}>
              <Listapedidos />
            </Proteccion>
          }
        />
        <Route
          path="/NuevoProducto"
          element={
            <Proteccion roles={["1"]}>
              <NuevoProducto />
            </Proteccion>
          }
        />
        <Route
          path="/categoria/:categoriaId"
          element={
            <Proteccion roles={["1", "2"]}>
              <ProductosPorCategoria />
            </Proteccion>
          }
        />
        <Route
          path="/Datos"
          element={
            <Proteccion rolse={["1"]}>
              <Datos></Datos>
            </Proteccion>
          }
        ></Route>
        <Route
          path="/NuevaCategoria"
          element={
            <Proteccion rolse={["1"]}>
              <RegistrarCategoria></RegistrarCategoria>
            </Proteccion>
          }
        ></Route>
        <Route
          path="/ListaClientes"
          element={
            <Proteccion rolse={["1"]}>
              <ListaClientes></ListaClientes>
            </Proteccion>
          }
        ></Route>
        <Route
          path="/ActualizarCliente/:id"
          element={
            <Proteccion rolse={["1"]}>
              <ActualizarCliente></ActualizarCliente>
            </Proteccion>
          }
        ></Route>
          <Route
          path="/CategoriaProducto/:id"
          element={
            <Proteccion rolse={["1","2"]}>
              <CategoriaProducto></CategoriaProducto>
            </Proteccion>
          }
        ></Route>
        <Route
          path="/EliminarUsuario"
          element={
            <Proteccion rolse={["1", "2"]}>
              <EliminarUsuario></EliminarUsuario>
            </Proteccion>
          }
        ></Route>
             <Route
          path="/EliminarUsuario/:id"
          element={
            <Proteccion rolse={["1"]}>
              <EliminarUsuario></EliminarUsuario>
            </Proteccion>
          }
        ></Route>
            <Route
          path="/ListapedidosActivos"
          element={
            <Proteccion rolse={["1", "2"]}>
              <ListapedidosActivos></ListapedidosActivos>
            </Proteccion>
          }
        ></Route>
            <Route
          path="/ResultadosBusqueda"
          element={
            <Proteccion rolse={["1", "2"]}>
              <ResultadosBusqueda></ResultadosBusqueda>
            </Proteccion>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
