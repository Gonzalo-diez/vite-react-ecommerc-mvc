import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaUser } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Menu({ isAuthenticated }) {
    const { userId } = useAuth();

    return(
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Mercado</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated ? (
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos/tecnologia">Tecnologia</Nav.Link>
                            <Nav.Link as={Link} to="/productos/vestimenta">Vestimenta</Nav.Link>
                            <Nav.Link as={Link} to="/productos/libros">Libros</Nav.Link>
                            <Nav.Link as={Link} to="/carrito"><IoCartOutline /></Nav.Link>
                            <Nav.Link as={Link} to={`/usuarios/${userId}`}><FaUser /></Nav.Link>
                        </Nav>
                    ):(
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos/tecnologia">Tecnologia</Nav.Link>
                            <Nav.Link as={Link} to="/productos/vestimenta">Vestimenta</Nav.Link>
                            <Nav.Link as={Link} to="/productos/libros">Libros</Nav.Link>
                            <Nav.Link as={Link} to="/login"><FaUser /></Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Menu;