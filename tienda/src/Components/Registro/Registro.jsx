import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { useAuth } from "../Context/AuthContext";

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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const res = await axios.post("http://localhost:8800/usuarios/registro", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (res.status === 200) {
        const token = res.data.token;
        
        localStorage.setItem("jwtToken", token);

        setIsAuthenticated(true);
        const userData = res.data.user;
        if (userData) {
          setUser(userData);
          const userId = userData._id;
          setAuthenticatedUserId(userId);
          navigate(`/usuarios/protected/${userId}`);
        } else {
          console.log("User data is missing in the response.")
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveAvatar = (e) => {
    setAvatar(e.target.files[0])
  }

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
          <Form.Control 
          type="file"
          onChange={handleSaveAvatar} 
          />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Registro
          </Button>
          <Link to="/usuarios/login">Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default Registro;