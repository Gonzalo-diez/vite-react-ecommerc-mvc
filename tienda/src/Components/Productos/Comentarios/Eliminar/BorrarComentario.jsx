import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import io from "socket.io-client";

function BorrarComentario({ isAuthenticated }) {
    const [comment, setComment] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken");
    const socket = io("http://localhost:8800");

    console.log(token);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const commentData = await axios.get(`http://localhost:8800/productos/comentarios/${id}`);
                setComment(commentData.data);
            } catch (error) {
                console.error("Error al obtener el comentario:", error);
            }
        };
        fetchProducto();
    }, [id]);

    const handleEliminar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para eliminar comentarios.");
            navigate("/usuarios/login");
            return;
        }
        try {
            await axios.delete(`http://localhost:8800/comentarios/protected/borrarComentario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            socket.emit("comentario-eliminado", id);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleCancelar = () => {
        navigate("/");
    };

    return (
        <Container className="text-center">
            <h2>Eliminar Comentario</h2>
            <p>¿Estás seguro de que deseas eliminar este comentario?</p>
            {comment && (
                <div className="eliminar-container">
                    <h2>{comment.name}</h2>
                    <p>{comment.description}</p>
                </div>
            )}
            <Button variant="danger" onClick={handleEliminar} className="m-2">Sí, eliminar</Button>
            <Button variant="secondary" onClick={handleCancelar}>No, cancelar</Button>
        </Container>
    );
}

export default BorrarComentario;