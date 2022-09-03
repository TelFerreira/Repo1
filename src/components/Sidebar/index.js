import React, { useState, useEffect } from "react";
import "./index.css";
import AuthService from "../../services/auth.service";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { Card, Form, Modal } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();

  function logoutUser() {
    AuthService.logout();
    navigate("/login");
  }

  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  const [user, setUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (storageUser) {
      AuthService.getCurrentUser(storageUser.token).then((response) => setUser(response));
    }
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="top">
          <span className="logo">Softinsa Reunions</span>
        </div>
        <hr />
        <div className="center">
          <ul>
            <p className="title">MENU PRINCIPAL</p>
            <li onClick={() => navigate("/dashboard")}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
            <p className="title">MENU LISTA</p>
            <li onClick={() => navigate("/utilizadores")}>
              <GroupIcon className="icon" />
              <span>Utilizadores</span>
            </li>
            <li onClick={() => navigate("/salas")}>
              <ProductionQuantityLimitsIcon className="icon" />
              <span>Salas</span>
            </li>
            <li onClick={() => navigate("/centros")}>
              <Inventory2Icon className="icon" />
              <span>Centros</span>
            </li>
            <li onClick={() => navigate("/localizacoes")}>
              <LocalShippingIcon className="icon" />
              <span>Localizações</span>
            </li>
            <li onClick={() => navigate("/reservas")}>
              <ListAltIcon className="icon" />
              <span>Reservas</span>
            </li>
            <p className="title">MENU OUTROS</p>
            <li>
              <NotificationsIcon className="icon disabled" />
              <span className="disabled">Notificações</span>
            </li>
            <p className="title">CONTA PESSOAL</p>
            <li onClick={() => navigate("/alterarPassword/" + user.id_utilizador)}>
              <PersonIcon className="icon" />
              <span>Alterar Password</span>
            </li>
            <li onClick={handleShow1}>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>

      <Modal show={show1} onHide={handleClose1} dialogClassName="modal-90w">
        <Form onSubmit={logoutUser}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Terminar Sessão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card_sidebar" style={{ height: "fit-content" }}>
              <Card.Body>
                <h5>Tem a certeza que quer terminar a sessão?</h5>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Confirmar
            </Button>
            <Button onClick={handleClose1} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Fechar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Sidebar;
