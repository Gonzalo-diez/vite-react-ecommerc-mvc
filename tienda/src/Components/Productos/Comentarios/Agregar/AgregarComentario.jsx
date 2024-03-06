import React, { useState } from "react";
import { Form, Button, Toast } from 'react-bootstrap';
import { BiSolidCommentAdd } from "react-icons/bi";
import axios from "axios";
import io from "socket.io-client";

function AgregarComentario({ isAuthenticated, userId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState("");
    const [userName, setUserName] = useState("");
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);

    const socket = io("http://localhost:8800");

    const handleComentarioChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleNombreChange = (event) => {
        setName(event.target.value);
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

                const response = await axios.post(`${serverUrl}/comentarios/protected/agregarComentario`, comentarioData, {
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

                socket.emit("comentario-agregado", response.data);
            } catch (err) {
                console.error('Error al agregar el comentario:', err);
            }
        } else {
            alert("Debes iniciar sesión o registrarte para comentar.");
        }
    };

    return (
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
    );
}

export default AgregarComentario;