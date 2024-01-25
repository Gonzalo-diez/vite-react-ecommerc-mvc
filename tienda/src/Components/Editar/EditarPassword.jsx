import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const EditarPassword = () => {
    const { userId } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleGuardarCambios = async () => {
        try {
            const response = await axios.put(`/usuarios/protected/cambiarContrasena/${userId}`, {
                currentPassword,
                newPassword,
                passwordConfirm,
            });

            console.log('Respuesta del servidor:', response.data);

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
                        <Form.Group className="mb-3" controlId="formContrasenaActual">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña actual"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNuevaContrasena">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmarContrasena">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleGuardarCambios}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPassword;
