import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Footer/Layout';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Login from './Login/Login';
import Registro from './Registro/Registro';
import AgregarProductos from './Agregar/AgregarProducto';
import BorrarProducto from './Borrar/BorrarProducto';
import EditarProducto from './Editar/EditarProducto';
import Carrito from './Carrito/Carrito';
import ProductoCategoria from './Productos/Categoria/ProductoCategoria';
import Producto from './Productos/Producto';
import User from './User/User';
import EditarPassword from './Editar/EditarPassword';
import EditarPerfil from './Editar/EditarPerfil';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          <Route path="/usuarios/:userId" element={<User isAuthenticated={isAuthenticated} user={user} setUser={setUser} />} />
          <Route path="/usuarios/protected/editarPerfil/:id" element={<EditarPerfil />} />
          <Route path="/usuarios/protected/cambiarContrasena/:id" element={<EditarPassword />} />
          <Route path="/productos/detalle/:id" element={<Producto isAuthenticated={isAuthenticated} addToCart={addToCart} user={user} />} />
          <Route path="/productos/:category" element={<ProductoCategoria />} />
          <Route path="/productos/protected/agregar" element={<AgregarProductos isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/protected/borrar/:id" element={<BorrarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/protected/editar/:id" element={<EditarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/carrito" element={<Carrito cart={cart} removeFromCart={removeFromCart} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;