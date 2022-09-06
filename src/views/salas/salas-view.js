import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Form, Modal, Table } from "react-bootstrap";
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
    if (storageUser)
      AuthService.getCurrentUser(storageUser.token).then((response) =>
        setcurrentUser(response)
      );
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function handleSubmit() {
    if (
      nomeSala !== "" &&
      descricao !== "" &&
      alocacaoMaxima !== "" &&
      alocacao_percent !== "" &&
      tempoLimpeza != "" &&
      centro.length != 0
    ) {
      const baseUrl = "https://backend-pint2022.herokuapp.com/salas/register";
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
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/salas/delete/" + idtoDelete;
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
        .get("https://backend-pint2022.herokuapp.com/salas/list", {
          headers: authHeader(),
        })
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
        .get(
          "https://backend-pint2022.herokuapp.com/centros/listActiveCenters",
          { headers: authHeader() }
        )
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

    const baseUrl =
      "https://backend-pint2022.herokuapp.com/user/passwordNeedsUpdate/" +
      storageUser.token;
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
      <Navbar title="Salas" user={currentUser} />
      <div className="d-flex gap-2 w-25 my-2 mx-auto">
        <button className="btn btn-primary h-100" onClick={handleShow1}>
          Criar
        </button>
      </div>
      <Table className="w-75 mx-auto" striped bordered hover>
        <thead>
          <tr>
            <th>Sala</th>
            <th>Estado</th>
            <th>Descrição</th>
            <th>Alocação Máxima</th>
            <th>Disponível</th>
            <th>Tempo Limpeza</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salaList?.map((sala, index) => (
            <tr>
              <td>{sala.nomesala}</td>
              <td>
                {sala.activeStatus ? (
                  <div>
                    <span className="dot-active" /> Ativa{" "}
                  </div>
                ) : (
                  <div>
                    <span className="dot-inactive" /> Inativa{" "}
                  </div>
                )}
              </td>
              <td>{sala.descricao}</td>
              <td>{sala.alocacao_maxima}</td>
              <td>{sala.alocacao_percent}</td>
              <td>{sala.tempo_limpeza}</td>
              <td>
                <div className="d-flex gap-2">
                  <a
                    className="btn btn-primary h-100"
                    sx={{ marginRight: "8px" }}
                    href={"/editarSala/" + sala.id_sala}
                  >
                    Editar
                  </a>
                  <button
                    className="btn btn-danger h-100"
                    onClick={() => {
                      setSalatoDelete(sala);
                      handleShow2();
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show1} onHide={handleClose1} dialogClassName="modal-90w">
        <Form noValidate validated={validated} onSubmit={checkSubmitValues}>
          <Modal.Header closeButton>
            <Modal.Title>Nova Sala</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nomeCentro">
              <Form.Control
                required
                type="text"
                placeholder="Nome"
                onChange={(value) => setNomeSala(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="descricao">
              <Form.Control
                required
                type="text"
                placeholder="Descrição"
                onChange={(value) => setDescricao(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Form.Group className="mb-3" controlId="alocacaoMaxima">
                <Form.Control
                  required
                  type="text"
                  placeholder="Alocação (ex:10)"
                  onChange={(value) => setalocacaoMaxima(value.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 w-100" controlId="alocacao_percent">
                <Form.Control
                  required
                  type="text"
                  placeholder="Alocação máxima em % (ex:50)"
                  onChange={(value) => setalocacao_percent(value.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo Obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="d-flex gap-2">
              <Form.Group className="mb-3 w-100" controlId="tempoLimpeza">
                <Form.Control
                  required
                  type="text"
                  placeholder="Tempo de limpeza (ex:30) em minutos"
                  onChange={(value) => settempoLimpeza(value.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo Obrigatório.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 w-50">
                <Form.Select
                  required
                  onChange={(value) => setCentro(value.target.value)}
                >
                  <option hidden value={0}>
                    Centro
                  </option>
                  {listacentro?.map((centro, index) => (
                    <option key={index} value={centro.id_centro}>
                      {centro.nomecentro}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button className="btn btn-success h-100" type="submit">
                Criar
              </button>
              <button
                className="btn btn-danger h-100"
                onClick={handleClose1}
                sx={{ marginRight: 1 }}
              >
                Voltar
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={show2} onHide={handleClose2} dialogClassName="modal-90w">
        <Form>
          <Modal.Header closeButton>
            <Modal.Title
              style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}
            >
              Eliminar Sala
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <div style={{ fontSize: "20px" }}>
                  {" "}
                  Tem a certeza que quer eliminar a sala de{" "}
                  {salatoDelete.nomesala}?
                </div>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => handleDeleteSala(salatoDelete.id_sala)}
              sx={{ marginRight: 1 }}
              variant="outlined"
              color="success"
            >
              Eliminar
            </Button>
            <Button
              onClick={handleClose2}
              sx={{ marginRight: 1 }}
              variant="outlined"
              color="error"
            >
              Fechar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Salas;
