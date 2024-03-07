import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { IoPencil, IoTrash, IoStar } from "react-icons/io5";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";

function Comentario({ isAuthenticated, userId }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const { id } = useParams();

    const socket = io("http://localhost:8800");
    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comentariosRes = await axios.get(`${serverUrl}/productos/comentarios/${id}`);
                setComments(comentariosRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        socket.on("comentario-agregado", (comentarioAgregado) => {
            if (!comments.some(comment => comment._id === comentarioAgregado._id)) {
                setComments(prevComments => [...prevComments, comentarioAgregado]);
            }
        });
        
        socket.on("comentario-editado", (comentarioEditado) => {
            setComments(prevComments => [...prevComments, comentarioEditado]);
        });
        
        socket.on("comentario-eliminado", (comentarioEliminadoId) => {
            setComments(prevComments => prevComments.filter(comment => comment._id !== comentarioEliminadoId));
        });
        
        fetchComments();
    }, [id]);

    const handleEliminarComentario = async (id) => {
        try {
            navigate(`/comentarios/protected/borrarComentario/${id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="comentarios-container">
            <h3>Opiniones</h3>
            {comments.length === 0 ? (
                <p>Sin comentarios</p>
            ) : (
                <Row>
                    <Col md={9}>
                        {comments.length === 0 ? (
                            <p>Sin comentarios</p>
                        ) : (
                            <div className="comentarios-list">
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