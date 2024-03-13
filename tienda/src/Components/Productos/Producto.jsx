import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Toast, ToastContainer, Carousel } from 'react-bootstrap';
import { IoCart } from "react-icons/io5";
import Comentario from "./Comentarios/Comentario";
import Pregunta from "./Preguntas/Pregunta";
import AgregarComentario from "./Comentarios/Agregar/AgregarComentario";
import AgregarPregunta from "./Preguntas/Agregar/AgregarPregunta";
import { useAuth } from "../Context/authContext";
import { useCart } from "../Context/CartContext";

function Producto({ isAuthenticated, user, socket }) {
    const { setCart, addToCart, hasPurchased, setHasPurchased } = useCart();
    const { userId } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productCreatedByUser, setProductCreatedByUser] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);

    const token = localStorage.getItem("jwtToken");
    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        socket.connect();

        const fetchProducto = async () => {
            try {
                const res = await axios.get(`${serverUrl}/productos/detalle/${id}`);
                setProduct(res.data);
                setProductCreatedByUser(res.data.user);

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

        fetchProducto();

        return () => {
            socket.off("producto-agregado");
            socket.off("producto-editado");
            socket.off("producto-eliminado");
            socket.off("producto-comprado");
            socket.off("producto-vendido");
            socket.disconnect();
        };
    }, [id, isAuthenticated, user]);

    useEffect(() => {
        socket.connect();

        socket.on("producto-agregado", (productoAgregado) => {
            setProduct((prevProduct) => [...prevProduct, productoAgregado]);
        });

        socket.on("producto-editado", (productoEditado) => {
            setProduct((prevProduct) => [...prevProduct, productoEditado]);
        });

        socket.on("producto-eliminado", (productoEliminado) => {
            setProduct(prevProducts => prevProducts.filter(p => p._id !== productoEliminado));
        });

        socket.on("producto-comprado", (productoComprado) => {
            setCart((prevCart) => [...prevCart, productoComprado]);
        });

        socket.on("producto-vendido", (productoVendido) => {
            setCart((prevCart) => [...prevCart, productoVendido]);
        });

        return () => {
            socket.off("producto-agregado");
            socket.off("producto-editado");
            socket.off("producto-eliminado");
            socket.off("producto-comprado");
            socket.off("producto-vendido");
            socket.disconnect();
        };
    })

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setShowToast(true);
        setHasPurchased(true);
    };

    if (!product) {
        return <p className="text-center">Producto no encontrado. Puede estar fuera de stock o ha sido eliminado.</p>;
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
            <Pregunta socket={socket} isAuthenticated={isAuthenticated} userId={userId} token={token} user={user} productCreatedByUser={productCreatedByUser} />
            <AgregarPregunta socket={socket} isAuthenticated={isAuthenticated} userId={userId} user={user} />
            <Comentario socket={socket} isAuthenticated={isAuthenticated} userId={userId} token={token} user={user} />
            <AgregarComentario socket={socket} isAuthenticated={isAuthenticated} userId={userId} user={user} />
        </div>
    );
}

export default Producto;