import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from 'react-bootstrap';
import { IoPencil, IoTrash } from "react-icons/io5";
import axios from "axios";
import ResponderPregunta from "./Responder/ResponderPregunta";

function Pregunta({ isAuthenticated, userId, user, productCreatedByUser, socket }) {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { id } = useParams();

    const token = localStorage.getItem("jwtToken");
    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        socket.connect();

        const fetchQuestions = async () => {
            try {
                const preguntasRes = await axios.get(`${serverUrl}/productos/preguntas/${id}`);
                setQuestions(preguntasRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchQuestions();

        return () => {
            socket.off("pregunta-agregada");
            socket.off("pregunta-editada");
            socket.off("pregunta-eliminada");
            socket.off("pregunta-respondida");
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        socket.connect();

        socket.on("pregunta-agregada", (preguntaAgregada) => {
            setQuestions((prevQuestion) => [...prevQuestion, preguntaAgregada]);
        });

        socket.on("pregunta-editada", (preguntaEditada) => {
            setQuestions((prevQuestion) => [...prevQuestion, preguntaEditada]);
        });

        socket.on("pregunta-eliminada", (preguntaEliminada) => {
            setQuestions((prevQuestion) => prevQuestion.filter(q => q._id !== preguntaEliminada));
        });

        socket.on("pregunta-respondida", (preguntaRespondida) => {
            setQuestions((prevQuestion) => [...prevQuestion, preguntaRespondida]);
        });

        socket.disconnect();
    })

    const handleEliminarPregunta = async (preguntaId) => {
        try {
            const token = localStorage.getItem("jwtToken");

            await axios.delete(`http://localhost:8800/preguntas/protected/borrarPregunta/${preguntaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            socket.emit("pregunta-eliminada", preguntaId);

            setQuestions(prevQuestions => prevQuestions.filter(question => question._id !== preguntaId));
        } catch (error) {
            console.error("Error al eliminar pregunta:", error);
        }
    };

    return (
        <div className="comentarios-container">
            <h3>Preguntas</h3>
            {questions.length === 0 ? (
                <p>Sin preguntas</p>
            ) : (
                <Row>
                    <Col md={9}>
                        {questions.map((question, index) => (
                            <div key={question._id || index} className="comentario">
                                {question.name && (
                                    <p>
                                        <strong key={`text-${question._id}-${index}`}>{question.name}:</strong>
                                    </p>
                                )}
                                <p>{question.text}</p>
                                {question.responses.length > 0 && (
                                    <ul>
                                        {question.responses.map((response, idx) => (
                                            <li className="respuestas" key={idx}>
                                                <strong>{response.name}</strong>: {response.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {isAuthenticated && userId === question.user && (
                                    <div className="inicio-link-container">
                                        <Button variant="warning" onClick={() => navigate(`/preguntas/protected/editarPregunta/${question._id}`)}>
                                            <IoPencil />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleEliminarPregunta(question._id)}>
                                            <IoTrash />
                                        </Button>
                                    </div>
                                )}
                                {productCreatedByUser && userId && productCreatedByUser.trim() === userId.trim() && (
                                    <Button variant="primary" onClick={() => setShowReplyForm(!showReplyForm)}>
                                        Responder
                                    </Button>
                                )}
                                {showReplyForm && productCreatedByUser !== null && userId === productCreatedByUser && (
                                    <ResponderPregunta productCreatedByUser={productCreatedByUser} questionId={question._id} isAuthenticated={isAuthenticated} token={token} user={user} userId={userId} />
                                )}
                            </div>
                        ))}
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default Pregunta;