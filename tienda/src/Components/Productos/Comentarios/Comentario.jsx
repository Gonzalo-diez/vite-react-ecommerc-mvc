import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { IoPencil, IoTrash, IoStar } from "react-icons/io5";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import StarRating from "../StarRating";

function Comentario({ isAuthenticated, userId }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const { id } = useParams();

    const socket = io("http://localhost:8800");
    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        socket.connect();
        const fetchComments = async () => {
            try {
                const comentariosRes = await axios.get(`${serverUrl}/productos/comentarios/${id}`);
                setComments(comentariosRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchComments();

        return () => {
            socket.off("comentario-agregado");
            socket.off("comentario-editado");
            socket.off("comentario-eliminado");
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        socket.connect();

        socket.on("comentario-agregado", (comentarioAgregado) => {
            setComments((prevComments) => [...prevComments, comentarioAgregado]);
        });

        socket.on("comentario-editado", (comentarioEditado) => {
            setComments((prevComments) => [...prevComments, comentarioEditado]);
        });

        socket.on("comentario-eliminado", (comentarioEliminadoId) => {
            setComments((prevComments) => prevComments.filter(comment => comment._id !== comentarioEliminadoId));
        });

        return () => {
            socket.off("comentario-agregado");
            socket.off("comentario-editado");
            socket.off("comentario-eliminado");
            socket.disconnect();
        };
    }, []);

    const calculateAverageRating = () => {
        if (comments.length === 0) {
            return 0;
        }

        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    };

    const handleEliminarComentario = async (comentarioId) => {
        try {
            const token = localStorage.getItem("jwtToken");

            await axios.delete(`http://localhost:8800/comentarios/protected/borrarComentario/${comentarioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            socket.emit("comentario-eliminado", comentarioId);

            setComments(prevComments => prevComments.filter(comment => comment._id !== comentarioId));
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
        }
    };

    return (
        <div className="comentarios-container">
            <h3>Opiniones</h3>
            {comments.length === 0 ? (
                <div>
                    <p>Sin comentarios</p>
                </div>
            ) : (
                <Row>
                    <Col md={3} className="mt-3">
                        {comments.length > 0 && (
                            <div className="average-rating">
                                <h4>Promedio de Ratings</h4>
                                <StarRating averageRating={calculateAverageRating()} />
                            </div>
                        )}
                    </Col>
                    <Col md={9}>
                        {comments.length === 0 ? (
                            <p>Sin comentarios</p>
                        ) : (
                            <div className="comentarios-list mt-3">
                                {comments.map((comment, index) => (
                                    <div key={comment._id || index} className="comentario">
                                        {comment.name && (
                                            <p>
                                                <strong key={`text-${comment._id}-${index}`}>{comment.name}:</strong>
                                            </p>
                                        )}
                                        <p>{comment.text}</p>
                                        <p>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip id={`tooltip-rating-${comment._id}-${index}`}>{`Rating: ${comment.rating}`}</Tooltip>}
                                            >
                                                <span className="rating-stars">
                                                    {Array.from({ length: comment.rating }, (_, i) => (
                                                        <IoStar key={i} />
                                                    ))}
                                                </span>
                                            </OverlayTrigger>
                                        </p>
                                        <p key={`date-${comment._id}-${index}`}>Fecha: {moment(comment.date).format('lll')}</p>
                                        {isAuthenticated && userId && userId === comment.user && (
                                            <div className="inicio-link-container">
                                                <Button variant="warning" onClick={() => navigate(`/comentarios/protected/editarComentario/${comment._id}`)}>
                                                    <IoPencil />
                                                </Button>
                                                <Button variant="danger" onClick={() => handleEliminarComentario(comment._id)}>
                                                    <IoTrash />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default Comentario;