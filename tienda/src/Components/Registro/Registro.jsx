import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";

const Registro = ({ setIsAuthenticated, setUser }) => {
  const { setAuthenticatedUserId } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/usuarios/registro", {
        name: name,
        surname: surname,
        email: email,
        password: password,
        avatar: avatar,
      });
      if (res.status === 200) {
        setIsAuthenticated(true);
        const userData = res.data.usuario;
        setUser(userData);
        const userId = userData._id;
        setAuthenticatedUserId(userId);
        navigate(`/user/${userId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de usuario</h2>
      <Form onSubmit={handleRegistro}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="apellido">
          <Form.Label>Apellido:</Form.Label>
          <Form.Control
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Form.Group>
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
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>avatar</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Registro
          </Button>
          <Link to="/login">Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default Registro;