import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import '../css/App.css';

const Carrito = ({ carrito, removeFromCart }) => {
  const [showCompraForm, setShowCompraForm] = useState(false);
  const [pais, setPais] = useState('');
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [calle, setCalle] = useState('');
  const [telefono, setTelefono] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [numeroSeguridad, setNumeroSeguridad] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showEmptyCartToast, setShowEmptyCartToast] = useState(false);


  const handleCompra = async () => {
    if (carrito.length === 0) {
      setShowEmptyCartToast(true);
      return;
    }

    if (!showCompraForm) {
      setShowCompraForm(true);
      return;
    }

    try {
      for (const producto of carrito) {
        const productId = producto._id;

        const response = await axios.post("http://localhost:8800/comprar", {
          productId,
          pais,
          provincia,
          localidad,
          calle,
          telefono,
          numero_tarjeta: numeroTarjeta,
          numero_seguridad: numeroSeguridad,
        });
        console.log(response.data);
        removeFromCart(productId);
        setShowToast(true);
      }

      setShowCompraForm(false);
      setPais('');
      setProvincia('');
      setLocalidad('');
      setCalle('');
      setTelefono('');
      setNumeroTarjeta('');
      setNumeroSeguridad('');
    } catch (error) {
      console.error("Error al comprar:", error);
    }
  };

  return (
    <div className="carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((producto) => (
            <li key={producto._id}>
              {producto.nombre} - ${producto.precio}
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
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formProvincia">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  name="provincia"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLocalidad">
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  name="localidad"
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCalle">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTelefono">
                <Form.Label>Télefono</Form.Label>
                <Form.Control
                  type="number"
                  name="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumeroTarjeta">
                <Form.Label>Tarjeta</Form.Label>
                <Form.Control
                  type="number"
                  name="numeroTarjeta"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumeroSeguridad">
                <Form.Label>Numero de seguridad</Form.Label>
                <Form.Control
                  type="number"
                  name="numeroSeguridad"
                  value={numeroSeguridad}
                  onChange={(e) => setNumeroSeguridad(e.target.value)}
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