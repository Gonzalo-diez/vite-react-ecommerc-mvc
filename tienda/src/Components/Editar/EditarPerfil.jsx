import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const EditarPerfil = () => {
    const { userId } = useAuth();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/usuarios/detalle/${userId}`);
                const user = response.data;

                console.log('User data:', user);

                if (!user) {
                    console.error("Usuario no encontrado");
                    return;
                }

                setName(user.name);
                setSurname(user.surname);
                setEmail(user.email);
                setAvatar(user.avatar);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };
        fetchPerfil();
    }, [userId]);



    const handleGuardarCambios = async () => {
        try {
            const token = localStorage.getItem("jwtToken");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("surname", surname);
            formData.append("email", email);
            formData.append("avatar", avatar);

            const response = await axios.put(`http://localhost:8800/usuarios/protected/editarPerfil/${userId}`, formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            console.log('Respuesta del servidor:', response.data);

        } catch (error) {
            console.error('Error al guardar cambios:', error.response || error.message);
        }
    };

    const handleEditAvatar = (e) => {
        setAvatar(e.target.files[0])
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 mb-4">Editar Perfil</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formApellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu apellido"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Form.Control
                            type="file"
                            onChange={handleEditAvatar}
                        />
                        <Button variant="primary" onClick={handleGuardarCambios}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPerfil;