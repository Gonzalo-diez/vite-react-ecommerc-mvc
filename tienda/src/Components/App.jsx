import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Footer/Layout';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Login from './Login/Login';
import Registro from './Registro/Registro';
import AgregarProducto from "./Productos/Agregar/AgregarProducto";
import BorrarProducto from './Productos/Eliminar/BorrarProducto';
import EditarProducto from './Productos/Editar/EditarProducto';
import Carrito from './Carrito/Carrito';
import ProductoCategoria from './Productos/Categoria/ProductoCategoria';
import Producto from './Productos/Producto';
import User from './User/User';
import EditarPassword from './User/Editar/EditarPassword';
import EditarPerfil from './User/Editar/EditarPerfil';
import EditarComentario from './Productos/Comentarios/Editar/EditarComentario';
import EditarPregunta from './Productos/Preguntas/Editar/EditarPregunta';
import io from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const socket = io("http://localhost:8800");

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} user={user} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/usuarios/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/usuarios/registro" element={<Registro setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/usuarios/protected/:userId" element={<User isAuthenticated={isAuthenticated} user={user} setUser={setUser} />} />
          <Route path="/usuarios/protected/editarPerfil/:id" element={<EditarPerfil />} />
          <Route path="/usuarios/protected/cambiarContrasena/:userId" element={<EditarPassword />} />
          <Route path="/comentarios/protected/editarComentario/:id" element={<EditarComentario socket={socket} />} />
          <Route path="/preguntas/protected/editarPregunta/:id" element={<EditarPregunta />} />
          <Route path="/productos/detalle/:id" element={<Producto isAuthenticated={isAuthenticated} socket={socket} user={user} />} />
          <Route path="/productos/:category" element={<ProductoCategoria />} />
          <Route path="/productos/protected/agregarProducto" element={<AgregarProducto socket={socket} isAuthenticated={isAuthenticated} user={user} />} />
          <Route path="/productos/protected/borrarProducto/:id" element={<BorrarProducto socket={socket} isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/protected/editarProducto/:id" element={<EditarProducto socket={socket} isAuthenticated={isAuthenticated} />} />
          <Route path="/carrito/protected/comprar" element={<Carrito socket={socket} isAuthenticated={isAuthenticated} user={user} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;