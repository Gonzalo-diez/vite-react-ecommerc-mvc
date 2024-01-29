import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";

function User({ isAuthenticated, user, setUser }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bought, setBought] = useState(null);
  const [sold, setSold] = useState(null);

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

    const fetchBoughtProduct = async () => {
      try {
        const boughtRes = await axios.get(`${serverUrl}/usuarios/protected/productosComprados/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (boughtRes.data) {
          setBought(boughtRes.data);
          console.log(boughtRes.data);
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada:", boughtRes.data);
        }
      }
      catch {
        console.log("Error al encontrar los productos comprados:", err);
      }
    }

    const fetchSoldProduct = async () => {
      try {
        const soldRes = await axios.get(`${serverUrl}/usuarios/protected/productosVendidos/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (soldRes.data) {
          setSold(soldRes.data);
          console.log(soldRes.data);
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada:", soldRes.data);
        }
      }
      catch {
        console.log("Error al encontrar los productos vendidos:", err);
      }
    }

    fetchUser();
    fetchCreatedProduct();
    fetchBoughtProduct();
    fetchSoldProduct();
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

          <div>
            <h3>Productos Comprados:</h3>
            {bought && bought.boughtProducts && bought.boughtProducts.length > 0 ? (
              <ul>
                {bought.boughtProducts.map((boughtProd) => (
                  <li key={boughtProd._id}>
                    <strong>Título:</strong> {boughtProd.title}, <strong>Cantidad:</strong> {boughtProd.quantity}, <strong>Precio Total:</strong> {boughtProd.price}
                    <Button onClick={() => navigate(`/productos/detalle/${boughtProd._id}`)}>Detalles</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No has comprado productos aún.</p>
            )}
          </div>

          <div>
            <h3>Productos Vendidos:</h3>
            {sold && sold.soldProducts && sold.soldProducts.length > 0 ? (
              <ul>
                {sold.soldProducts.map((soldProd) => (
                  <li key={soldProd._id}>
                    <strong>Título:</strong> {soldProd.title}, <strong>Cantidad:</strong> {soldProd.quantity}, <strong>Precio Total:</strong> {soldProd.price}
                    <Button onClick={() => navigate(`/productos/detalle/${soldProd._id}`)}>Detalles</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No has vendido productos aún.</p>
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