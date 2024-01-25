import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/App.css";

function Footer() {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          <Col md={6} lg={8} className="d-flex justify-content-center">
            <ul className="footer-links">  
              <li className="mx-4">
                <a href="https://github.com/Gonzalo-diez" target="_blank">
                  GitHub
                </a>
              </li>
              <li className="mx-4">
                <a href="https://www.linkedin.com/in/gdiezbuchanan/" target="_blank">
                  LinkedIn
                </a>
              </li>
              <li className="mx-4">
                <a href="https://portfolio-gonzalo-diez.netlify.app/" target="_blank">
                  Portfolio
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
