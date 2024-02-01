import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Toast, ToastContainer, Row, Col, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoCart, IoStar, IoStarOutline, IoPencil, IoTrash } from "react-icons/io5";
import { BiSolidCommentAdd } from "react-icons/bi";
import { useAuth } from '../Context/authContext';
import StarRating from "./StarRating";

function Producto({ isAuthenticated, addToCart, user }) {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState("");
    const [userName, setUserName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

    const calculateAverageRating = () => {
        if (comments.length === 0) {
            return 0;
        }

        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    };

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

                    const boughtProductsRes = await axios.get(`${serverUrl}/usuarios/protected/productosComprados/${user._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setHasPurchased(boughtProductsRes.data.length > 0);
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
        addToCart({ ...product, quantity });
        setShowToast(true);
        setHasPurchased(true);
    };

    const handleComentarioChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleNombreChange = (event) => {
        setName(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEliminarComentario = async (id) => {
        try {
            navigate(`/comentarios/protected/borrar/${id}`);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                const comentarioData = {
                    text: newComment,
                    rating: rating,
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
                    setHasCommented(true);
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
                        <Card.Text>Cantidad: {product.stock}</Card.Text>
                        <Form.Group controlId="formCantidad">
                            <Form.Label>Cantidad</Form.Label>
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
                        </Form.Group>
                        {isAuthenticated && !hasPurchased && (
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
                <h3>Opiniones</h3>
                {comments.length === 0 ? (
                    <p>Sin comentarios</p>
                ) : (
                    <Row>
                        <Col md={3}>
                            {comments.length > 0 && (
                                <div className="average-rating">
                                    <h4>Promedio de Ratings</h4>
                                    <StarRating averageRating={calculateAverageRating()} />
                                </div>
                            )}
                        </Col>

                        <Col md={9}>
                            {comments.length === 0 ? (
                                <p>Sin comentarios</p>
                            ) : (
                                <div className="comentarios-list">
                                    {displayedComments.map((comment) => (
                                        <div key={comment._id} className="comentario">
                                            {comment.name && (
                                                <p>
                                                    <strong>{comment.name}:</strong>
                                                </p>
                                            )}
                                            <p>{comment.text}</p>
                                            <p>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    overlay={<Tooltip id={`tooltip-rating-${comment._id}`}>{`Rating: ${comment.rating}`}</Tooltip>}
                                                >
                                                    <span className="rating-stars">
                                                        {Array.from({ length: comment.rating }, (_, i) => (
                                                            <IoStar key={i} />
                                                        ))}
                                                    </span>
                                                </OverlayTrigger>
                                            </p>
                                            <p>Fecha: {new Date(comment.date).toLocaleString()}</p>
                                            {isAuthenticated && userId && userId === comment.user && (
                                                <div className="inicio-link-container">
                                                    <Button variant="warning" onClick={() => navigate(`/comentarios/protected/editar/${comment._id}`)}>
                                                        <IoPencil />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleEliminarComentario(comment._id)}>
                                                        <IoTrash />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Col>
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
                {isAuthenticated && !hasCommented && (
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
                                <Form.Label>Deja una opinion:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={handleComentarioChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="rating">
                                <Form.Label>Rating:</Form.Label>
                                <span className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <IoStarOutline
                                            key={value}
                                            className={`star-icon ${value <= rating ? 'filled' : ''}`}
                                            onClick={() => handleRatingChange(value)}
                                        />
                                    ))}
                                </span>
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