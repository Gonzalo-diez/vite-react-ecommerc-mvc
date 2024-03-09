import React, { useState, useEffect } from "react";
import { Form, Button, Toast } from 'react-bootstrap';
import { BiSolidCommentAdd } from "react-icons/bi";
import { IoStarOutline } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

function AgregarComentario({ isAuthenticated, userId, user }) {
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState("");
    const [userName, setUserName] = useState("");
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [hasCommented, setHasCommented] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken");
    const serverUrl = "http://localhost:8800";
    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                if (isAuthenticated && user && user._id) {
                    const userRes = await axios.get(`${serverUrl}/usuarios/detalle/${user._id}`);
                    setUserName(userRes.data.name);
                }
            } catch (err) {
                console.error('Error al obtener el nombre del usuario:', err);
            }
        };

        fetchUserName();
    }, [isAuthenticated, user]);

    const handleComentarioChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                if (!token) {
                    console.error('No se encontró el token de autenticación.');
                    navigate("/usuarios/login");
                }

                const comentarioData = {
                    text: newComment,
                    rating: rating,
                    userId: userId,
                    productId: id,
                    name: userName,
                };

                const response = await axios.post(`${serverUrl}/comentarios/protected/agregarComentario`, comentarioData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setNewComment("");
                    setShowToastComentario(true);
                    setHasCommented(true);
                }

                socket.emit("comentario-agregado", comentarioData);

                setShowForm(false);
            } catch (err) {
                console.error('Error al agregar el comentario:', err);
            }
        } else {
            alert("Debes iniciar sesión o registrarte para comentar.");
        }
    };

    return (
        isAuthenticated && (
            <div className="nuevo-comentario">
                {showForm && (
                    <Form>
                        <Form.Group controlId="nombre">
                            <Form.Label>Tu Nombre:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={userName}
                                onChange={handleComentarioChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="nuevoComentario">
                            <Form.Label>Deja una opinión:</Form.Label>
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
                )}
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
                    <Toast.Body>Tu comentario se agregó.</Toast.Body>
                </Toast>
            </div>
        )
    );
}

export default AgregarComentario;