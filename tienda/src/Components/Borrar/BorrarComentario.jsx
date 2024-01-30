import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

function BorrarComentario({ isAuthenticated }) {
    const [comment, setComment] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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
            console.log("Debes estar autenticado para eliminar productos.");
            navigate("/login");
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");

            await axios.delete(`http://localhost:8800/comentarios/protected/borrar/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
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
            {producto && (
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