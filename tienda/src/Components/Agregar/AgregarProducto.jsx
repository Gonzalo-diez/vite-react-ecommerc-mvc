import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "../css/App.css";

function AgregarProductos({ isAuthenticated }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      console.log("Debes estar autenticado para agregar productos.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("image", image);

      const response = await axios.post("http://localhost:8800/productos/protected/agregar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message);

      navigate("/");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleSaveImage = (e) => {
    setImage(e.target.files[0]);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default AgregarProductos;