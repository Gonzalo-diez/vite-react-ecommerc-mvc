import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const EditarPassword = () => {
    const { userId } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSavePassword = async () => {
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await axios.put(`http://localhost:8800/usuarios/protected/cambiarContrasena/${userId}`, {
                newPassword,
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });

            console.log('Respuesta del servidor:', response.data);
            navigate(`/usuarios/${userId}`)

        } catch (error) {
            console.error('Error al guardar cambios de contraseña:', error.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 mb-4">Cambiar Contraseña</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNuevaContrasena">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleSavePassword}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPassword;