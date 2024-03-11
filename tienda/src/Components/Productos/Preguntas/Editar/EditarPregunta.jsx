import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import io from "socket.io-client";

const EditarPregunta= () => {
    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState('');

    const token = localStorage.getItem("jwtToken");
    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchPregunta = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/preguntas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const pregunta = response.data;
                setNewPregunta(pregunta.text);
            } catch (error) {
                console.error('Error al obtener el comentario:', error);
            }
        };

        fetchPregunta();
    }, [id, userId]);

    const handlePreguntaChange = (event) => {
        setNewQuestion(event.target.value);
    };

    const handleActualizarPregunta = async () => {
        try {
            const preguntaData = {
                text: newQuestion,
                userId,
            };

            const response = await axios.put(
                `http://localhost:8800/preguntas/protected/editarPregunta/${id}`,
                preguntaData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Datos a enviar', response.data);
            setNewQuestion('');
            socket.emit("pregunta-editada", response.data);


            navigate("/")
        } catch (error) {
            console.error('Error al actualizar la pregunta:', error);
        }
    };

    return (
        <Form>
            <Form.Group controlId="nuevaPregunta">
                <Form.Label>Editar Comentario:</Form.Label>
                <Form.Control as="textarea" rows={3} value={newQuestion} onChange={handlePreguntaChange} />
            </Form.Group>
            <Button onClick={handleActualizarPregunta} variant="primary" className="mr-2">
                Actualizar Comentario
            </Button>
        </Form>
    );
};

export default EditarPregunta;