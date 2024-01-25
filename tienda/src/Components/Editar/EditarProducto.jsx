import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "../css/App.css";

function EditarProducto({ isAuthenticated }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                const producto = response.data;

                if (!producto) {
                    console.error("Producto no encontrado");
                    return;
                }

                setName(producto.name);
                setBrand(producto.brand);
                setDescription(producto.description);
                setPrice(producto.price);
                setStock(producto.stock);
                setCategory(producto.category);
                setImage(producto.image);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProducto();
    }, [id]);


    const handleActualizar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para editar tus productos.");
            navigate("/usuarios/login");
            return;
        }
        try {
            console.log("Datos a enviar:", {
                name,
                brand,
                description,
                price,
                stock,
                category,
                image,
            });

            const response = await axios.put(`http://localhost:8800/productos/protected/editar/${id}`, {
                name,
                brand,
                description,
                price,
                stock,
                category,
                image,
            });

            console.log(response.data.message);
            navigate("/");
        } catch (error) {
            console.error("Error en la actualización:", error);
        }
    };


    return (
        <div className="agregar-container">
            <h2>Actualizar producto</h2>
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
                <Form.Group controlId="categoria">
                    <Form.Label>categoria:</Form.Label>
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="indumentaria">Vestimenta</option>
                        <option value="libros">Libros</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="imagen">
                    <Form.Label>imagen:</Form.Label>
                    <Form.Control
                        type="file"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleActualizar} className="button-link-container">Actualizar</Button>
            </Form>
        </div>
    );
}

export default EditarProducto;