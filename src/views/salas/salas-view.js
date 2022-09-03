import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import authHeader from "../../services/auth-header";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import "./salas-view.css";

const Salas = () => {
  const navigate = useNavigate();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [salaList, setsalaList] = useState();
  const [error, setError] = useState("");

  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  const [show2, setShow2] = useState(false);
  const handleShow2 = () => setShow2(true);
  const handleClose2 = () => setShow2(false);

  const [validated, setValidated] = useState(false);

  const [salatoDelete, setSalatoDelete] = useState("");

  const [nomeSala, setNomeSala] = useState("");
  const [descricao, setDescricao] = useState("");
  const [alocacaoMaxima, setalocacaoMaxima] = useState("");
  const [alocacao_percent, setalocacao_percent] = useState("");
  const [tempoLimpeza, settempoLimpeza] = useState("");

  const [listacentro, setListaCentro] = useState([]);
  const [centro, setCentro] = useState([]);

  function getCurrentUser() {
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function handleSubmit() {
    if (nomeSala !== "" && descricao !== "" && alocacaoMaxima !== "" && alocacao_percent !== "" && tempoLimpeza != "" && centro.length != 0) {
      const baseUrl = "https://softinsa-reunions-back.herokuapp.com/salas/register";
      const datapost = {
        nomesala: nomeSala,
        descricao: descricao,
        alocacao_maxima: alocacaoMaxima,
        alocacao_percent: alocacao_percent,
        tempo_limpeza: tempoLimpeza,
        activeStatus: true,
        id_centro: centro,
      };
      axios
        .post(baseUrl, datapost)
        .then((response) => {
          if (response.data.success) {
            alert("Sala inserido");
          } else {
            alert("ERRO" + response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
    }
  }

  function handleDeleteSala(idtoDelete) {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/salas/delete/" + idtoDelete;
    axios
      .delete(baseUrl, { headers: authHeader() })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          window.location.reload();
          alert("Sala eliminada");
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
    function getSalasList() {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/salas/list", { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            setsalaList(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }
    function getCentrosData() {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/centros/listActiveCenters", { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            setListaCentro(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }

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
    getSalasList();
    getCentrosData();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar title="Salas" user={currentUser} />
          <div className="pageContent">
            <div className="menu-wrapper">
              <Button onClick={handleShow1} sx={{ marginRight: 1 }} variant="contained" endIcon={<AddCircleOutlineIcon />}>
                Criar Nova Sala
              </Button>
            </div>
            <div className="content-wrapper">
              <div className="card-wrapper row">
                {salaList?.map((sala, index) => (
                  <div className="card-item col-4" key={sala.id_sala}>
                    <Card className="card_salas" sx={{ height: "fit-content" }}>
                      <CardContent>
                        <Typography sx={{ fontWeight: "bold" }} gutterBottom variant="h5" component="div">
                          {"Sala " + sala.nomesala}
                        </Typography>
                        <Typography sx={{ padding: "1%" }} variant="body2" color="text.secondary" component="div">
                          {sala.activeStatus ? (
                            <div>
                              <span className="dot-active" /> Ativa{" "}
                            </div>
                          ) : (
                            <div>
                              <span className="dot-inactive" /> Inativa{" "}
                            </div>
                          )}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button sx={{ marginRight: "8px" }} href={"/editarSala/" + sala.id_sala} size="small" variant="outlined" color="success">
                          Editar
                        </Button>
                        <Button
                          onClick={() => {
                            setSalatoDelete(sala);
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
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Criar Sala</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="nomeCentro">
                  <Form.Label>Nome Sala</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza nome" onChange={(value) => setNomeSala(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira um nome.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="descricao">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza descrição" onChange={(value) => setDescricao(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira uma descrição.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="alocacaoMaxima">
                  <Form.Label>Alocação Sala (nr.)</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza alocação da sala" onChange={(value) => setalocacaoMaxima(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira a alocação da sala.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="alocacao_percent">
                  <Form.Label>Alocação da sala (%)</Form.Label>
                  <Form.Control required type="text" placeholder="Insira a %  de alocação da sala." onChange={(value) => setalocacao_percent(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira a % de alocação da sala.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="tempoLimpeza">
                  <Form.Label>Tempo de Limpeza (min.)</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza o tempo de limpeza da sala" onChange={(value) => settempoLimpeza(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira o tempo de limpeza.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Centro</Form.Label>
                  <Form.Select required onChange={(value) => setCentro(value.target.value)}>
                    <option hidden value={0}>
                      Escolha um Centro
                    </option>
                    {listacentro?.map((centro, index) => (
                      <option key={index} value={centro.id_centro}>
                        {centro.nomecentro}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Criar Sala
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
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Eliminar Sala</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <div style={{ fontSize: "20px" }}> Tem a certeza que quer eliminar a sala de {salatoDelete.nomesala}?</div>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleDeleteSala(salatoDelete.id_sala)} sx={{ marginRight: 1 }} variant="outlined" color="success">
              Eliminar
            </Button>
            <Button onClick={handleClose2} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Fechar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Salas;
