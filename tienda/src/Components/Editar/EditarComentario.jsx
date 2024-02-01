import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditarComentario = () => {
    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState('');

    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchComentario = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/comentarios/protected/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const comentario = response.data;
                setNewComment(comentario.text);
                setRating(comentario.rating);
            } catch (error) {
                console.error('Error al obtener el comentario:', error);
            }
        };

        fetchComentario();
    }, [id, userId]);

    const handleComentarioChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleActualizarComentario = async () => {
        try {
            const comentarioData = {
                text: newComment,
                rating: rating,
                userId,
            };

            const response = await axios.put(
                `http://localhost:8800/comentarios/protected/editar/${id}`,
                comentarioData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Datos a enviar', response.data);
            setNewComment('');
            setRating('');
            navigate("/")
        } catch (error) {
            console.error('Error al actualizar el comentario:', error);
        }
    };

    return (
        <Form>
            <Form.Group controlId="nuevoComentario">
                <Form.Label>Editar Comentario:</Form.Label>
                <Form.Control as="textarea" rows={3} value={newComment} onChange={handleComentarioChange} />
            </Form.Group>
            <Form.Group controlId="rating">
                <Form.Label>Rating:</Form.Label>
                <span className="rating-stars">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={`star-icon ${value <= rating ? 'filled' : ''}`}
                            onClick={() => handleRatingChange(value)}
                        >
                            ★
                        </span>
                    ))}
                </span>
            </Form.Group>
            <Button onClick={handleActualizarComentario} variant="primary" className="mr-2">
                Actualizar Comentario
            </Button>
        </Form>
    );
};

export default EditarComentario;