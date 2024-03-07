import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Toast, ToastContainer, Carousel } from 'react-bootstrap';
import { IoCart } from "react-icons/io5";
import Comentario from "./Comentarios/Comentario";
import AgregarComentario from "./Comentarios/Agregar/AgregarComentario";
import { useAuth } from "../Context/authContext";
import io from "socket.io-client";

function Producto({ isAuthenticated, addToCart, user }) {
    const { userId } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    const socket = io("http://localhost:8800")
    const serverUrl = "http://localhost:8800";
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`${serverUrl}/productos/detalle/${id}`);
                setProduct(res.data);

                if (isAuthenticated && user && user._id) {
                    const boughtProductsRes = await axios.get(`${serverUrl}/usuarios/protected/productosComprados/${user._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setHasPurchased(boughtProductsRes.data.length > 0);
                }
            } catch (err) {
                console.log(err);
            }
        };

        socket.on("producto-agregado", (productoAgregado) => {
            console.log("Producto agregado:", productoAgregado);
            setProduct((prevProduct) => [...prevProduct, productoAgregado]);
        });

        socket.on("producto-editado", (productoEditado) => {
            console.log("Producto editado:", productoEditado);
            setProduct((prevProduct) => [...prevProduct, productoEditado]);
        });

        socket.on("producto-eliminado", (productoEliminado) => {
            console.log("Producto eliminado:", productoEliminado);
            setProduct((prevProduct) => [...prevProduct, productoEliminado]);
        });

        fetchProducto();
    }, [id, isAuthenticated, user]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setShowToast(true);
        setHasPurchased(true);
    };

    if (!product) {
        return <p>No hay productos de esta categoría</p>;
    }

    return (
        <div className="producto-container">
            <div className="producto-details">
                <Card key={product._id} className="text-center card-producto m-auto mt-4">
                    <Carousel variant="dark">
                        {product.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 img-fluid card-image"
                                    src={`http://localhost:8800/${image}`}
                                    alt={product.title}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <Card.Body>
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text>Marca: {product.brand}</Card.Text>
                        <Card.Text>$<strong>{product.price}</strong></Card.Text>
                        <Card.Text>Cantidad: {product.stock}</Card.Text>
                        <Card.Text>{product.description}</Card.Text>
                        <Card.Text>Cantidad: {product.stock}</Card.Text>
                        {isAuthenticated && !hasPurchased && (
                            <div>
                                <Form.Group controlId="formCantidad" className="d-flex align-items-center">
                                    <Button
                                        variant="primary"
                                        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                    >
                                        -
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        name="cantidad"
                                        value={quantity}
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value, 10);
                                            setQuantity(newQuantity >= 1 ? newQuantity : 1);
                                        }}
                                        required
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </Form.Group>
                                <Button onClick={handleAddToCart} variant="primary" className="mt-3">Agregar al Carrito <IoCart /></Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
                <ToastContainer position="middle-center">
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={3000}
                        autohide
                        bg="success"
                        text="white"
                    >
                        <Toast.Header>
                            <strong className="mr-auto">Producto en carrito</strong>
                        </Toast.Header>
                        <Toast.Body>El producto se agregó a su carrito.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
            <Comentario isAuthenticated={isAuthenticated} userId={userId} token={token} />
            <AgregarComentario isAuthenticated={isAuthenticated} userId={userId} user={user} />
        </div>
    );
}

export default Producto;