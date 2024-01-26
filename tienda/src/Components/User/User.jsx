import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";

function User({ isAuthenticated, user, setUser }) {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const serverUrl = "http://localhost:8800";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/usuarios/${userId}`);
        // Verificar si la respuesta contiene datos y la estructura esperada
        if (res.data && res.data.name) {
          setUser(res.data);
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada:", res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleCambiarPassword = async () => {
    navigate(`/usuarios/protected/cambiarContrasena/${userId}`);
  };

  const handlerEditarPerfil = async () => {
    navigate(`/usuarios/protected/editarPerfil/${userId}`);
  };

  return (
    <section>
      {isAuthenticated ? (
        <div>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Bienvenido usuario</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>
                <strong>Nombre:</strong> {user?.name || "No disponible"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Apellido:</strong> {user?.surname || "No disponible"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Avatar:</strong>
                <img src={`${serverUrl}/${user?.avatar}`} alt="Avatar" />
              </ListGroupItem>
            </ListGroup>
          </Card>
          <div>
            <Button onClick={handlerEditarPerfil}>Editar Perfil</Button>
            <Button onClick={handleCambiarPassword}>Cambiar Contraseña</Button>
          </div>
        </div>
      ) : (
        <p>No está registrado o logueado.</p>
      )}
    </section>
  );
}

export default User;