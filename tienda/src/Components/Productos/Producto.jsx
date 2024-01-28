import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Toast, ToastContainer, Row, Col, Pagination } from 'react-bootstrap';
import { IoCart } from "react-icons/io5";
import { BiSolidCommentAdd } from "react-icons/bi";

function Producto({ isAuthenticated, addToCart, user }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [userName, setUserName] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

    const serverUrl = "http://localhost:8800";
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`${serverUrl}/productos/detalle/${id}`);
                setProduct(res.data);
        
                if (isAuthenticated && user && user._id) {
                    const userRes = await axios.get(`${serverUrl}/usuarios/detalle/${user._id}`);
                    setUserName(userRes.data.name);
                }
        
                const comentariosRes = await axios.get(`${serverUrl}/productos/comentarios/${id}`);
                console.log('Comentarios obtenidos:', comentariosRes.data);
                setComments(comentariosRes.data);
            } catch (err) {
                console.log(err);
            }
        };        
        fetchProducto();
    }, [id, isAuthenticated, user]);

    const handleAddToCart = () => {
        addToCart(product);
        setShowToast(true);
    };

    const userId = user ? user._id : null;

    const handleComentarioChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleNombreChange = (event) => {
        setName(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                const comentarioData = {
                    text: newComment,
                    userId: userId,
                    productId: id,
                    name: userName,
                };
    
                const response = await axios.post(`${serverUrl}/comentarios/protected/agregar`, comentarioData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.status === 200) {
                    const comentariosRes = await axios.get(`${serverUrl}/productos/comentarios/${id}`);
                    setComments(comentariosRes.data);
                    setNewComment("");
                    setShowToastComentario(true);
                }
            } catch (err) {
                console.error('Error al agregar el comentario:', err);
            }
        } else {
            alert("Debes iniciar sesión o registrarte para comentar.");
        }
    };
    

    if (!product) {
        return <p>No hay productos de esta categoria</p>;
    }

    return (
        <div className="producto-container">
            <div className="producto-details">
                <Card key={product._id} className="text-center card-producto m-auto mt-4">
                    <Card.Img variant="top" src={`${serverUrl}/${product.image}`} alt={product.title} />
                    <Card.Body>
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text>marca: {product.brand}</Card.Text>
                        <Card.Text>$<strong>{product.price}</strong></Card.Text>
                        <Card.Text>Cantidad: {product.stock}</Card.Text>
                        <Card.Text>{product.description}</Card.Text>
                        {isAuthenticated && (
                            <Button onClick={handleAddToCart} variant="primary">Agregar al Carrito <IoCart /></Button>
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
                        <Toast.Body>El producto se agrego a su carrito.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>

            <div className="comentarios-container">
                <h3>Comentarios</h3>
                {comments.length === 0 ? (
                    <p>Sin comentarios</p>
                ) : (
                    <Row>
                        {displayedComments.map((comment) => (
                            <Col key={comment._id} xs={12} md={6} lg={4}>
                                <div className="comentario">
                                    {comment.name && (
                                        <p><strong>{comment.name}:</strong></p>
                                    )}
                                    <p>{comment.text}</p>
                                    <p>Fecha: {new Date(comment.date).toLocaleString()}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                {comments.length > COMMENTS_PER_PAGE && (
                    <div className="pagination-container">
                        <Pagination className="mt-3">
                            {Array.from({ length: Math.ceil(comments.length / COMMENTS_PER_PAGE) }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                )}
                {isAuthenticated && (
                    <div className="nuevo-comentario">
                        <Form>
                            <Form.Group controlId="nombre">
                                <Form.Label>Tu Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    value={userName}
                                    onChange={handleNombreChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="nuevoComentario">
                                <Form.Label>Deja un comentario:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={handleComentarioChange}
                                />
                            </Form.Group>
                            <Button onClick={handleSubmitComentario} variant="primary" className="btn-comentario">
                               <BiSolidCommentAdd /> Comentario 
                            </Button>
                        </Form>
                        <Toast
                            show={showToastComentario}
                            onClose={() => setShowToastComentario(false)}
                            delay={3000}
                            autohide
                            bg="success"
                            text="white"
                        >
                            <Toast.Header>
                                <strong className="mr-auto">Comentario agregado</strong>
                            </Toast.Header>
                            <Toast.Body>Tu comentario se agrego.</Toast.Body>
                        </Toast>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Producto;