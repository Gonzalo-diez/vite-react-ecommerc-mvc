import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import io from "socket.io-client";

function BorrarProducto({ isAuthenticated }) {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const datosProducto = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                setProduct(datosProducto.data);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProducto();
    }, [id]);

    const handleEliminar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para eliminar productos.");
            navigate("/usuarios/login");
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await axios.delete(`http://localhost:8800/productos/protected/borrarProducto/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            socket.emit("producto-eliminado", response);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleCancelar = () => {
        navigate(`/productos/detalle/${id}`);
    };

    return (
        <Container className="text-center">
            <h2>Eliminar Producto</h2>
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            {product && (
                <div className="eliminar-container">
                    <h2>{product.title}</h2>
                    <img src={`http://localhost:8800/${product.images}`} alt={product.title} />
                </div>
            )}
            <Button variant="danger" onClick={handleEliminar} className="m-2">Sí, eliminar</Button>
            <Button variant="secondary" onClick={handleCancelar}>No, cancelar</Button>
        </Container>
    );
}

export default BorrarProducto;