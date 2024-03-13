import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { useAuth } from '../Context/authContext';
import { useCart } from '../Context/CartContext';

const Carrito = ({ isAuthenticated }) => {
  const { userId } = useAuth();
  const { removeFromCart, cart, setHasPurchased } = useCart();
  const [showCompraForm, setShowCompraForm] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showEmptyCartToast, setShowEmptyCartToast] = useState(false);
  const navigate = useNavigate();

  const socket = io("http://localhost:8800")
  const token = localStorage.getItem("jwtToken");

  const handleCompra = async () => {
    if (!isAuthenticated) {
      navigate("/usuarios/login");
    }

    if (cart.length === 0) {
      setShowEmptyCartToast(true);
      return;
    }

    if (!showCompraForm) {
      setShowCompraForm(true);
      return;
    }

    try {
      for (const producto of cart) {
        const productId = producto._id;

        const response = await axios.post("http://localhost:8800/carrito/protected/comprar", {
          productId,
          country,
          state,
          city,
          street,
          phone,
          cardBank,
          securityNumber,
          userId,
          quantity: producto.quantity,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        socket.emit("producto-comprado", response.data);
        socket.emit("producto-vendido", response.data);
        removeFromCart(productId);
        setHasPurchased(true);
        setShowToast(true);
        navigate("/")
      }

      setShowCompraForm(false);
      setCountry('');
      setState('');
      setCity('');
      setStreet('');
      setPhone('');
      setCardBank('');
      setSecurityNumber('');
    } catch (error) {
      console.error("Error al comprar:", error);
    }
  };

  return (
    <div className="carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        <ul>
          {cart.map((producto) => (
            <li key={producto._id}>
              {producto.title} - total: ${producto.price * producto.quantity}
              <Button variant="danger" onClick={() => removeFromCart(producto._id)} className="btn-eliminar">Quitar</Button>
            </li>
          ))}
        </ul>
        {showCompraForm ? (
          <div className="compra-form">
            <h3>Información de Compra</h3>
            <Form>
              <Form.Group controlId="formPais">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="pais"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formProvincia">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  name="provincia"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLocalidad">
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  name="localidad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCalle">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTelefono">
                <Form.Label>Télefono</Form.Label>
                <Form.Control
                  type="number"
                  name="telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumeroTarjeta">
                <Form.Label>Tarjeta</Form.Label>
                <Form.Control
                  type="number"
                  name="numeroTarjeta"
                  value={cardBank}
                  onChange={(e) => setCardBank(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumeroSeguridad">
                <Form.Label>Numero de seguridad</Form.Label>
                <Form.Control
                  type="number"
                  name="numeroSeguridad"
                  value={securityNumber}
                  onChange={(e) => setSecurityNumber(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCompra} className="btn-comprar">Realizar Compra</Button>
            </Form>
          </div>
        ) : (
          <Button variant="primary" onClick={handleCompra}>Comprar</Button>
        )}
      </div>
      <ToastContainer position='bottom-center'>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
          text="white"
        >
          <Toast.Header>
            <strong className="mr-auto">Compra exitosa</strong>
          </Toast.Header>
          <Toast.Body>Tu compra se ha realizado con éxito.</Toast.Body>
        </Toast>
        <Toast
          show={showEmptyCartToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="danger"
          text="white"
        >
          <Toast.Header closeButton={false}>
            <strong className="mr-auto">Carrito vacio</strong>
          </Toast.Header>
          <Toast.Body>El carrito está vacío. Agrega productos antes de comprar.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Carrito;