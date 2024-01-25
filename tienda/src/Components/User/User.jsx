import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";

function User({ isAuthenticated, usuario, setUsuario }) {
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/usuarios/${userId}`);
                setUsuario(res.data);
                console.log(res.data)
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, [userId]);

    const handleCambiarPassword = async() => {
        navigate(`/usuarios/protected/cambiarContrasena/${userId}`);
    }

    const handlerEditarPerfil = async() => {
        navigate(`/usuarios/protected/editarPerfil/${userId}`);
    }

    return (
        <section>
            {isAuthenticated ? (
                <div>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>User Information</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <strong>Productos creados:</strong>
                                <ul>
                                    {usuario.productosCreados &&
                                        usuario.productosCreados.map(producto => (
                                            <li key={producto._id}>{producto.nombre}</li>
                                        ))}
                                </ul>
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Productos comprados:</strong>
                                <ul>
                                    {usuario.productosComprados &&
                                        usuario.productosComprados.map(producto => (
                                            <li key={producto._id}>{producto.nombre}</li>
                                        ))}
                                </ul>
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Productos vendidos:</strong>
                                <ul>
                                    {usuario.productosVendidos &&
                                        usuario.productosVendidos.map(producto => (
                                            <li key={producto._id}>{producto.nombre}</li>
                                        ))}
                                </ul>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                    <div>
                        <Button onClick={handlerEditarPerfil}>Editar Perfil</Button>
                        <Button onClick={handleCambiarPassword}>Cambiar Contraseña</Button>
                    </div>
                </div>
            ) : (
                <p>No esta registrado o logueado.</p>
            )}
        </section>
    );
}

export default User;