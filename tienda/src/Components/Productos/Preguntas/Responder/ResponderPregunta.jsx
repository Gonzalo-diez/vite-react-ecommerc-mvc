import React, { useState, useEffect } from "react";
import { Form, Button, Toast } from 'react-bootstrap';
import { BiSolidCommentAdd } from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

function ResponderPregunta({ isAuthenticated, userId, user, productUserId }) {
    const [responder, setResponder] = useState("");
    const [userName, setUserName] = useState("");
    const [showToastPregunta, setShowToastPregunta] = useState(false);
    const [showForm, setShowForm] = useState(true);
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

    const handleReponderChange = (event) => {
        setResponder(event.target.value);
    };

    const handleSubmitRespuesta = async () => {
        if (isAuthenticated && userId === productUserId) {
            try {
                if (!token) {
                    console.error('No se encontró el token de autenticación.');
                    navigate("/usuarios/login");
                }

                const responderData = {
                    text: responder,
                    userId: userId,
                    productId: id,
                    name: userName,
                };

                const response = await axios.post(`${serverUrl}/preguntas/protected/responderPregunta/:id`, responderData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setResponder("");
                    setShowToastPregunta(true);
                }

                socket.emit("pregunta-respondida", responderData);

                setShowForm(false);
            } catch (err) {
                console.error('Error al responder el comentario:', err);
            }
        } else {
            console.log("Debes ser el creado del producto para responder a este comentario.");
        }
    };

    return (
            <div className="nuevo-comentario form-container">
                {showForm && (
                    <Form>
                        <Form.Group controlId="nombre">
                            <Form.Label>Tu Nombre:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={userName}
                                onChange={handleReponderChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="responder">
                            <Form.Label>Responde:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={responder}
                                onChange={handleReponderChange}
                            />
                        </Form.Group>
                        <Button onClick={handleSubmitRespuesta} variant="primary" className="btn-comentario">
                            <BiSolidCommentAdd /> Responder
                        </Button>
                    </Form>
                )}
                <Toast
                    show={showToastPregunta}
                    onClose={() => setShowToastPregunta(false)}
                    delay={3000}
                    autohide
                    bg="success"
                    text="white"
                >
                    <Toast.Header>
                        <strong className="mr-auto">Respuesta agregada</strong>
                    </Toast.Header>
                    <Toast.Body>Tu respuesta se agregó.</Toast.Body>
                </Toast>
            </div>
        )
}

export default ResponderPregunta;