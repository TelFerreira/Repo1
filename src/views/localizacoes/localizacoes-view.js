import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal, Alert } from "react-bootstrap";
import authHeader from "../../services/auth-header";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import "./localizacoes-view.css";

const Centros = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [localizacaoList, setlocalizacaoList] = useState();
  const [error, setError] = useState("");

  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  const [show2, setShow2] = useState(false);
  const handleShow2 = () => setShow2(true);
  const handleClose2 = () => setShow2(false);

  const [show3, setShow3] = useState(false);
  const handleShow3 = () => setShow3(true);
  const handleClose3 = () => setShow3(false);

  const [show4, setShow4] = useState(false);
  const handleShow4 = () => setShow4(true);
  const handleClose4 = () => setShow4(false);

  const [validated, setValidated] = useState(false);

  const [nomeFreguesia, setNomeFreguesia] = useState("");
  const [nomeDistrito, setNomeDistrito] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const [localtoDelete, setLocaltoDelete] = useState("");

  async function getCurrentUser() {
    if (storageUser) {
      await AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
    }
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function handleSubmit() {
    if (nomeFreguesia !== "" || nomeDistrito !== "" || codigoPostal !== "") {
      const baseUrl = "https://softinsa-reunions-back.herokuapp.com/localizacoes/register";
      const datapost = {
        freguesia: nomeFreguesia,
        distrito: nomeDistrito,
        codigopostal: codigoPostal,
      };
      axios
        .post(baseUrl, datapost)
        .then((response) => {
          if (response.data.success) {
            handleClose1();
            handleShow4();
          } else {
            alert("ERRO" + response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
    }
  }

  function handleDeleteLocal(idtoDelete) {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/localizacoes/delete/" + idtoDelete;
    axios
      .delete(baseUrl, { headers: authHeader() })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          handleClose2();
          handleShow3();
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
  }

  const checkSubmitValues = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    handleSubmit();
  };

  useEffect(() => {
    axios
      .get("https://softinsa-reunions-back.herokuapp.com/localizacoes/list", { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          setlocalizacaoList(res.data.data);
        } else {
          setError(res.data.data);
        }
      })
      .catch((error) => {
        setError(error.toString());
      });

    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/user/passwordNeedsUpdate/" + storageUser.token;
    axios
      .post(baseUrl, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          navigate("/alterarPassword/" + response.data.data);
        }
      })
      .catch((error) => {});

    getCurrentUser();
    isUserLogged();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar title="Localizações" user={currentUser} />
          <div className="pageContent">
            <div className="menu-wrapper">
              <Button onClick={handleShow1} sx={{ marginRight: 1 }} variant="contained" endIcon={<AddCircleOutlineIcon />}>
                Criar Nova Localização
              </Button>
            </div>
            <div className="content-wrapper">
              <div className="card-wrapper row">
                {localizacaoList?.map((localizacao, index) => (
                  <div className="card-item col-4" key={localizacao.id_local}>
                    <Card className="card_localizacoes" sx={{ height: "fit-content" }}>
                      <CardContent>
                        <Typography sx={{ fontWeight: "bold" }} gutterBottom variant="h5" component="div">
                          {localizacao.freguesia}
                        </Typography>
                        <Typography sx={{ padding: "1%" }} variant="body2" color="text.secondary" component="div">
                          {localizacao.codigopostal}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button sx={{ marginRight: "8px" }} href={"/editarLocal/" + localizacao.id_local} size="small" variant="outlined" color="success">
                          Editar
                        </Button>
                        <Button
                          onClick={() => {
                            setLocaltoDelete(localizacao);
                            handleShow2();
                          }}
                          size="small"
                          variant="outlined"
                          color="error"
                        >
                          Eliminar
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show1} onHide={handleClose1} dialogClassName="modal-90w">
        <Form noValidate validated={validated} onSubmit={checkSubmitValues}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Criar Localização</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="nomeFreguesia">
                  <Form.Label>Freguesia</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza nome da freguesia" onChange={(value) => setNomeFreguesia(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira o nome da freguesia.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="nomeDistrito">
                  <Form.Label>Distrito</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza nome do distrito" onChange={(value) => setNomeDistrito(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira o nome do distrito.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="codigoPostal">
                  <Form.Label>Codigo-Postal</Form.Label>
                  <Form.Control required type="text" placeholder="Ex: 3000-999" onChange={(value) => setCodigoPostal(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira o código postal.</Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Criar Localização
            </Button>
            <Button onClick={handleClose1} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Fechar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={show2} onHide={handleClose2} dialogClassName="modal-90w">
        <Form>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Eliminar Localização</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <div style={{ fontSize: "20px" }}> Tem a certeza que quer eliminar a localização de {localtoDelete.freguesia}?</div>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleDeleteLocal(localtoDelete.id_local)} sx={{ marginRight: 1 }} variant="outlined" color="success">
              Eliminar
            </Button>
            <Button onClick={handleClose2} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Fechar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={show3}
        onHide={() => {
          handleClose3();
          window.location.reload();
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Body style={{ backgroundColor: "light-green", border: "0" }}>
          <h5 style={{ display: "flex", justifyContent: "center" }}>Localização eliminada com sucesso.</h5>
        </Modal.Body>
      </Modal>

      <Modal
        show={show4}
        onHide={() => {
          handleClose4();
          window.location.reload();
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Body style={{ backgroundColor: "light-green", border: "0" }}>
          <h5 style={{ display: "flex", justifyContent: "center" }}>Localização inserida com sucesso.</h5>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Centros;
