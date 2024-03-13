import React, { useState, useEffect } from "react";
import { Form, Button, Toast } from 'react-bootstrap';
import { BiSolidCommentAdd } from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/authContext";

function AgregarPregunta({ isAuthenticated, user, socket }) {
    const { userId } = useAuth();
    const [newQuestion, setNewQuestion] = useState("");
    const [userName, setUserName] = useState("");
    const [showToastPregunta, setShowToastPregunta] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken");
    const serverUrl = "http://localhost:8800";

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

    const handlePreguntaChange = (event) => {
        setNewQuestion(event.target.value);
    };

    const handleSubmitPregunta = async () => {
        if (isAuthenticated) {
            try {
                if (!token) {
                    console.error('No se encontró el token de autenticación.');
                    navigate("/usuarios/login");
                }

                const preguntaData = {
                    text: newQuestion,
                    userId: userId,
                    productId: id,
                    name: userName,
                };

                const response = await axios.post(`${serverUrl}/preguntas/protected/agregarPregunta`, preguntaData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                socket.emit("pregunta-agregada", preguntaData);

                if (response.status === 200) {
                    setNewQuestion("");
                    setShowToastPregunta(true);
                }

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
            <div className="nuevo-comentario form-container">
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Tu Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tu nombre"
                            value={userName}
                            onChange={handlePreguntaChange}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group controlId="nuevaPregunta">
                        <Form.Label>Deja tu pregunta:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newQuestion}
                            onChange={handlePreguntaChange}
                        />
                    </Form.Group>
                    <Button onClick={handleSubmitPregunta} variant="primary" className="btn-pregunta">
                        <BiSolidCommentAdd /> Pregunta
                    </Button>
                </Form>

                <Toast
                    show={showToastPregunta}
                    onClose={() => setShowToastPregunta(false)}
                    delay={3000}
                    autohide
                    bg="success"
                    text="white"
                >
                    <Toast.Header>
                        <strong className="mr-auto">Pregunta agregada</strong>
                    </Toast.Header>
                    <Toast.Body>Tu pregunta se agregó.</Toast.Body>
                </Toast>
            </div>
        )
    );
}

export default AgregarPregunta;