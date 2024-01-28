import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";

function User({ isAuthenticated, user, setUser }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const serverUrl = "http://localhost:8800";
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/usuarios/protected/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (res.data && res.data.name) {
          setUser(res.data);
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada:", res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCreatedProduct = async () => {
      try {
        const productRes = await axios.get(`${serverUrl}/usuarios/protected/productosCreados/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (productRes.data) {
          setProduct(productRes.data);
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada:", productRes.data);
        }
      }
      catch (err) {
        console.log("Error al encontrar los productos creados:", err);
      }
    }

    fetchUser();
    fetchCreatedProduct();  // Agregado: Llamar a la función que obtiene los productos creados
  }, [userId]);

  const handleCambiarPassword = () => {
    navigate(`/usuarios/protected/cambiarContrasena/${userId}`);
  };

  const handlerEditarPerfil = () => {
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

          <div>
            <h3>Productos Creados:</h3>
            {product && product.createdProducts && product.createdProducts.length > 0 ? (
              <ul>
                {product.createdProducts.map((prod) => (
                  <li key={prod._id}>
                    <strong>Título:</strong> {prod.title}, <strong>Categoría:</strong> {prod.category}
                    <Button onClick={() => navigate(`/productos/detalle/${prod._id}`)}>Detalles</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No has creado productos aún.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No está registrado o logueado.</p>
      )}
    </section>
  );
}

export default User;