import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Toast } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";

const Login = ({ setIsAuthenticated, setUser }) => {
  const { setAuthenticatedUserId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/usuarios/login", {
        email: email,
        password: password,
      });
      if (res.status === 200) {
        setUser(res.data.usuario);
        setIsAuthenticated(true);
        navigate(`/`);
      }
    } catch (err) {
      console.log(err);
      setShowErrorToast(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar sesión</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
          <Link to="/registro">Registro</Link>
        </div>
      </Form>
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        bg="danger"
        text="white"
      >
        <Toast.Header>
          <strong className="mr-auto">Email o contraseña incorrectos</strong>
        </Toast.Header>
        <Toast.Body>Si usted no tiene cuenta registrese.</Toast.Body>
      </Toast>
    </div>
  );
};

export default Login;