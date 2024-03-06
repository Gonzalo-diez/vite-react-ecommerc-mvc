import React, { useState, useEffect } from "react";
import { Row, Col, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoPencil, IoTrash, IoStar } from "react-icons/io5";
import axios from "axios";

function Comentario({ isAuthenticated, userId }) {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comentariosRes = await axios.get(`${serverUrl}/productos/comentarios/${id}`);
                console.log('Comentarios obtenidos:', comentariosRes.data);
                setComments(comentariosRes.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchComments();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                                {displayedComments.map((comment) => (
                                    <div key={comment._id} className="comentario">
                                        {comment.name && (
                                            <p>
                                                <strong>{comment.name}:</strong>
                                            </p>
                                        )}
                                        <p>{comment.text}</p>
                                        <p>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip id={`tooltip-rating-${comment._id}`}>{`Rating: ${comment.rating}`}</Tooltip>}
                                            >
                                                <span className="rating-stars">
                                                    {Array.from({ length: comment.rating }, (_, i) => (
                                                        <IoStar key={i} />
                                                    ))}
                                                </span>
                                            </OverlayTrigger>
                                        </p>
                                        <p>Fecha: {new Date(comment.date).toLocaleString()}</p>
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
            {comments.length > COMMENTS_PER_PAGE && (
                <div className="pagination-container">
                    <Pagination className="mt-3">
                        {Array.from({ length: Math.ceil(comments.length / COMMENTS_PER_PAGE) }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            )}
        </div>
    );
}

export default Comentario;