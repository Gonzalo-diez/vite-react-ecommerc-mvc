import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import '../css/App.css';

const Carrito = ({ cart, removeFromCart, isAuthenticated, user }) => {
  const [showCompraForm, setShowCompraForm] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showEmptyCartToast, setShowEmptyCartToast] = useState(false);

  const token = localStorage.getItem("jwtToken");

  const handleCompra = async () => {
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

        let userEmailToUpdate = userEmail;

        if (isAuthenticated && user && user._id) {
          const userRes = await axios.get(`http://localhost:8800/usuarios/detalle/${user._id}`);
          userEmailToUpdate = userRes.data.email;
        }

        const response = await axios.post("http://localhost:8800/carrito/protected/comprar", {
          productId,
          country,
          state,
          city,
          street,
          phone,
          cardBank,
          securityNumber,
          email: userEmailToUpdate,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        removeFromCart(productId);
        setShowToast(true);
      }

      setShowCompraForm(false);
      setCountry('');
      setState('');
      setCity('');
      setStreet('');
      setPhone('');
      setCardBank('');
      setSecurityNumber('');
      setUserEmail('');
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
              {producto.title} - ${producto.price}
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
              <Form.Group controlId="userEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="userEmail"
                  value={userEmail || (isAuthenticated && user && user._id && user.email) || ''}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  disabled
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