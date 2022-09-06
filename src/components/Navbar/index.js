import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import softinsaLogo from "../../assets/img/softinsa-logo.png";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Form, Modal } from "react-bootstrap";
import authService from "../../services/auth.service";
import { useSelector } from "react-redux";

function isUser(user) {
  if (user && user.primeironome && user.sobrenome)
    return user.primeironome + " " + user.sobrenome;
  return "";
}

const CustomNavbar = () => {
  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);
  const { user: storageUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const logoutUser = () => {
    authService.logout();
    navigate("/login");
  };

  useEffect(() => {
    if (storageUser) {
      authService
        .getCurrentUser(storageUser.token)
        .then((response) => setUser(response));
    }
  }, [storageUser]);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={softinsaLogo}
              height="30"
              className="d-inline-block align-top"
              alt="Logo Softinsa"
            />
          </Navbar.Brand>
        </Container>
        {storageUser && (
          <Container>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav.Item onClick={() => navigate("/dashboard")}>
                Dashboard
              </Nav.Item>
              <Nav.Item onClick={() => navigate("/utilizadores")}>
                Utilizadores
              </Nav.Item>
              <Nav.Item onClick={() => navigate("/salas")}>Salas</Nav.Item>
              <Nav.Item onClick={() => navigate("/centros")}>Centros</Nav.Item>
              <Nav.Item onClick={() => navigate("/localizacoes")}>
                Localizações
              </Nav.Item>
              <Nav.Item onClick={() => navigate("/reservas")}>
                Reservas
              </Nav.Item>
            </Navbar.Collapse>
          </Container>
        )}
        <div className="items">
          <div className="item">
            {!storageUser ? (
              <Nav.Item>
                <a href="/login" className="btn btn-primary h-100">
                  Login
                </a>
              </Nav.Item>
            ) : (
              <NavDropdown title={isUser(user)}>
                <NavDropdown.Item
                  onClick={() =>
                    navigate("/alterarPassword/" + user.id_utilizador)
                  }
                >
                  Alterar Password
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShow1}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </div>
        </div>
      </Navbar>
      <Modal show={show1} onHide={handleClose1} dialogClassName="modal-90w">
        <Form onSubmit={logoutUser}>
          <Modal.Header closeButton>
            <Modal.Title>Terminar Sessão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Está prestes a terminar sessão...</h5>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger h-100"
                type="submit"
                sx={{ marginRight: 1 }}
              >
                Continuar
              </button>
              <button
                className="btn btn-primary h-100"
                onClick={handleClose1}
                sx={{ marginRight: 1 }}
              >
                Fechar
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CustomNavbar;
