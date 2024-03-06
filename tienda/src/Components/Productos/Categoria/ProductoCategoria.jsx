import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Pagination, Carousel } from 'react-bootstrap';

function ProductoCategoria() {
    const navigate = useNavigate();
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/productos/${category}`);
                setProducts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProductos();
    }, [category]);

    const productsPerPage = 6;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (currentProducts.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center alert">
                <p>No hay productos en esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center min-vh-100">
            {currentProducts.map((item) => (
                <Card key={item._id} className="mb-4">
                    <Carousel variant="dark">
                        {item.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={`${serverUrl}/${image}`}
                                    alt={`${item.title}-img-${index}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>Marca: {item.brand}</Card.Text>
                        <Card.Text>Precio: ${item.price}</Card.Text>
                        <Card.Text>Cantidad: {item.stock}</Card.Text>
                        <Button onClick={() => navigate(`/productos/detalle/${item._id}`)}>Ver más</Button>
                    </Card.Body>
                </Card>
            ))}
            <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default ProductoCategoria;
