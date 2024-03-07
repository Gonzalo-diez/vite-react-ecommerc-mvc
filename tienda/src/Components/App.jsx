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
import BorrarComentario from './Productos/Comentarios/Eliminar/BorrarComentario';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (producto) => {
    setCart([...cart, producto]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((producto) => producto._id === productId);
  
    if (index !== -1) {
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    }
  };

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
          <Route path="/comentarios/protected/editarComentario/:id" element={<EditarComentario />} />
          <Route path="/comentarios/protected/borrarComentario/:id" element={<BorrarComentario isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/detalle/:id" element={<Producto isAuthenticated={isAuthenticated} addToCart={addToCart} user={user} />} />
          <Route path="/productos/:category" element={<ProductoCategoria />} />
          <Route path="/productos/protected/agregarProducto" element={<AgregarProducto isAuthenticated={isAuthenticated} user={user} />} />
          <Route path="/productos/protected/borrarProducto/:id" element={<BorrarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/protected/editarProducto/:id" element={<EditarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/carrito/protected/comprar" element={<Carrito cart={cart} removeFromCart={removeFromCart} isAuthenticated={isAuthenticated} user={user} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;