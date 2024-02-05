import { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

function User({ isAuthenticated, user, setUser }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bought, setBought] = useState(null);
  const [sold, setSold] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const serverUrl = "http://localhost:8800";
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          console.log(boughtRes.data)
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
  }, [userId, windowWidth]);

  const handleCambiarPassword = () => {
    navigate(`/usuarios/protected/cambiarContrasena/${userId}`);
  };

  const handlerEditarPerfil = () => {
    navigate(`/usuarios/protected/editarPerfil/${userId}`);
  };

  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
  };

  const getSoldChart = (products) => {
    if (!products || products.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const radius = windowWidth < 768 ? 120 : 300;
  
    const validProducts = products.filter(
      (soldProd) => soldProd && soldProd.product && soldProd.product.title && soldProd.price && soldProd.quantity
    );
  
    if (validProducts.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }
  
    const names = validProducts.map((soldProd) => soldProd.product.title);
    const totalPrices = validProducts.map((soldProd) => soldProd.price * soldProd.quantity);
  
    const data = totalPrices;
  
    const backgroundColor = Array.from({ length: data.length }, () => getRandomColor());
  
    return {
      labels: names,
      datasets: [{
        data,
        backgroundColor,
        radius,
      }],
    };
  };  
  
  const soldOption = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  const getCreatedChart = (products) => {
    if (!products || products.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }
  
    const validProducts = products.filter((createdProd) => createdProd && createdProd.title && createdProd.stock);
    const names = validProducts.map((createdProd) => createdProd.title);
    const stock = validProducts.map((createdProd) => createdProd.stock);

    const radius = windowWidth < 768 ? 120 : 300;
    const backgroundColor = Array.from({ length: stock.length }, () => getRandomColor());
  
    return {
      labels: names,
      datasets: [{ data: stock, backgroundColor, radius,}],
    };
  };
  

  const createdOption = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <section>
      {isAuthenticated ? (
        <div>
          <div>
            <div className="user-card-container">
              <Card className="user-card">
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
                    <img src={`${serverUrl}/${user?.avatar}`} alt="Avatar" className="user-avatar" />
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </div>
            <div className="user-button-container">
                <Button onClick={handlerEditarPerfil}>Editar Perfil</Button>
                <Button onClick={handleCambiarPassword}>Cambiar Contraseña</Button>
            </div>
          </div>

          <div className="created-products-container">
            <h3>Productos Creados:</h3>
            {product && product.createdProducts && product.createdProducts.length > 0 ? (
              <div>
                <h4>Stock total de los productos creados</h4>
                <Pie data={getCreatedChart(product.createdProducts)} options={createdOption} />
              </div>
            ) : (
              <p>No has vendido productos aún.</p>
            )}
          </div>

          <div className="sold-products-container">
            <h3>Productos Vendidos:</h3>
            {sold && sold.soldProducts && sold.soldProducts.length > 0 ? (
              <div>
                <h4>Ganancia Total de Productos Vendidos</h4>
                <Pie data={getSoldChart(sold.soldProducts)} options={soldOption} />
              </div>
            ) : (
              <p>No has vendido productos aún.</p>
            )}
          </div>

          <div className="bought-products-container">
            <h3>Productos Comprados:</h3>
            {bought && bought.boughtProducts && bought.boughtProducts.length > 0 ? (
              <ul>
                {bought.boughtProducts.map((boughtProd) => (
                  <li key={boughtProd._id}>
                    <strong>Título:</strong> {boughtProd.title}, <strong>Cantidad:</strong> {boughtProd.quantity}, <strong>Precio Total:</strong> {boughtProd.price}
                    <Button onClick={() => navigate(`/productos/detalle/${boughtProd.product}`)}>Detalles</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No has comprado productos aún.</p>
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