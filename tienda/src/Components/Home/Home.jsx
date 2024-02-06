import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { IoPencil, IoTrash } from "react-icons/io5";
import axios from "axios";
import "../css/App.css";
import { useAuth } from "../Context/authContext";

function Home({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8800/productos/");
        setProducts(res.data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    fetchProductos();
  }, []);


  const handleEliminarProducto = async (productId) => {
    try {
      navigate(`/productos/protected/borrar/${productId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAgregarProducto = () => {
    navigate('/productos/protected/agregar');
  };

  return (
    <section>
      <main className="home-container">
        <Container>
          <Row>
            <Col>
              <section>
                <h2>Bienvenido a este proyecto E-commerce</h2>
                <p>Aqui encontraras las mejores ofertas del mercado</p>
              </section>
            </Col>
          </Row>
          <Row>
            {isAuthenticated && token ? (
              <Button variant="primary" onClick={handleAgregarProducto} >Agregar producto</Button>
            ) : (
              <Col>
                <h3>
                  Si quiere probar las funciones de agregar y borrar productos,
                  creese una cuenta.
                </h3>
                <div className="cta-buttons">
                  <Link to="/usuarios/login" className="btn btn-primary">
                    Login
                  </Link>
                  <Link to="/usuarios/registro" className="btn btn-outline-primary">
                    Registro
                  </Link>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </main>

      <section>
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4}>
              <Card className="mb-3 card-inicio">
                <Carousel variant="dark">
                  {product.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 img-fluid card-image"
                        src={`http://localhost:8800/${image}`}
                        alt={product.title}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>marca: {product.brand}</Card.Text>
                  <Card.Text>tipo: {product.category}</Card.Text>
                  <Card.Text>$<strong>{product.price}</strong></Card.Text>
                  <Card.Text>Cantidad: {product.stock}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => navigate(`/productos/detalle/${product._id}`)}>Ver más</Button>
                    {isAuthenticated && userId && userId === product.user._id && (
                      <div className="inicio-link-container">
                        <Button variant="warning" onClick={() => navigate(`/productos/protected/editar/${product._id}`)}><IoPencil /></Button>
                        <Button variant="danger" onClick={() => handleEliminarProducto(product._id)}><IoTrash /></Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </section>
  );
}

export default Home;
