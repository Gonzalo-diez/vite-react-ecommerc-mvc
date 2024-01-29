import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Menu({ isAuthenticated, user }) {
    const { userId } = useAuth();
    const navigate = useNavigate();

    const serverUrl = "http://localhost:8800";
    const token = localStorage.getItem("jwtToken");

    const handleLogOut = async () => {
        try {
            if (!token) {
                console.warn('Token no disponible');
                navigate('/', { replace: true });
                return;
            }
    
            await axios.get(`${serverUrl}/usuarios/protected/logout/$${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            localStorage.removeItem('jwtToken');
            console.log('Token eliminado correctamente');
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Error en cerrar sesión:', err);
        }
    };

    return(
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Mercado</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated && token ? (
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos/tecnologia">Tecnologia</Nav.Link>
                            <Nav.Link as={Link} to="/productos/vestimenta">Vestimenta</Nav.Link>
                            <Nav.Link as={Link} to="/productos/libros">Libros</Nav.Link>
                            <Nav.Link as={Link} to="/carrito/protected/comprar"><IoCartOutline /></Nav.Link>
                            <NavDropdown
                                title={<img src={`${serverUrl}/${user?.avatar}`} className="avatar" />}
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item as={Link} to={`/usuarios/protected/${userId}`}>Perfil</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={`/usuarios/protected/editarPerfil/${userId}`}>Ajustes</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogOut}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ):(
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos/tecnologia">Tecnologia</Nav.Link>
                            <Nav.Link as={Link} to="/productos/vestimenta">Vestimenta</Nav.Link>
                            <Nav.Link as={Link} to="/productos/libros">Libros</Nav.Link>
                            <Nav.Link as={Link} to="/usuarios/login"><FaUser /></Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Menu;
