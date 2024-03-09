import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import io from "socket.io-client";

function AgregarProducto({ isAuthenticated, user }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState(null);
  const [category, setCategory] = useState("");

  const userId = user ? user._id : null;
  const token = localStorage.getItem("jwtToken");
  const socket = io("http://localhost:8800")

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      console.log("Debes estar autenticado para agregar productos.");
      navigate("/usuarios/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }          
      formData.append("userId", userId);

      const response = await axios.post("http://localhost:8800/productos/protected/agregarProducto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message);
      socket.emit("producto-agregado", response.data);

      navigate("/");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleSaveImage = (e) => {
    setImages(e.target.files || []);
  }
   

  return (
    <div className="agregar-container">
      <h2>Agregar productos</h2>
      <Form>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del producto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="marca">
          <Form.Label>Marca del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Marca del producto"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="descripcion">
          <Form.Label>Descripción del producto:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Descripción del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="precio">
          <Form.Label>Precio del producto:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Precio del producto"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="stock">
          <Form.Label>Stock:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="url">
          <Form.Label>Imagen:</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleSaveImage}
          />
        </Form.Group>
        <Form.Group controlId="categoria">
          <Form.Label>categoria:</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>---</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="indumentaria">Vestimenta</option>
            <option value="libros">Libros</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={handleAgregar} className="button-link-container">Agregar producto</Button>
      </Form>
    </div>
  );
}

export default AgregarProducto;