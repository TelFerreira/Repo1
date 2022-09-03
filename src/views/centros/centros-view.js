import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import authHeader from "../../services/auth-header";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import "./centros-view.css";

const Centros = () => {
  const navigate = useNavigate();

  // --------------- GET CURRENT USER
  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);
  // --------------- GET CURRENT USER

  const [centroList, setcentroList] = useState();
  const [error, setError] = useState("");

  // --------------- OPEN MODALS
  /* Modal Criar Utilizador */
  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  /* Modal Eliminar Centro */
  const [show2, setShow2] = useState(false);
  const handleShow2 = () => setShow2(true);
  const handleClose2 = () => setShow2(false);
  // --------------- OPEN MODALS

  const [validated, setValidated] = useState(false);

  const [nomeCentro, setNomeCentro] = useState("");
  const [centrotoDelete, setCentrotoDelete] = useState("");

  const [listaLocalizacao, setlistaLocalizacao] = useState([]);
  const [localizacao, setLocalizacao] = useState("");

  function getCurrentUser() {
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function handleSubmit() {
    if (nomeCentro !== "" || localizacao !== "") {
      const baseUrl = "https://softinsa-reunions-back.herokuapp.com/centros/register";
      const datapost = {
        nomecentro: nomeCentro,
        activeStatus: true,
        id_local: localizacao,
      };
      axios
        .post(baseUrl, datapost, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            //alert("Centro inserido");
          } else {
            alert("ERRO" + response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
    }
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

  function handleDeleteCentro(idtoDelete) {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/centros/delete/" + idtoDelete;
    axios
      .delete(baseUrl, { headers: authHeader() })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          window.location.reload();
          alert("Filme eliminado");
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
  }

  useEffect(() => {
    function getCentrosList() {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/centros/list", { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            setcentroList(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }

    function getLocalizacoesData() {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/localizacoes/list", { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            setlistaLocalizacao(res.data.data);
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
      .catch((error) => {
        setError(error);
      });

    getLocalizacoesData();
    getCentrosList();
    getCurrentUser();
    isUserLogged();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar title="Centros" user={currentUser} />
          <div className="pageContent">
            <div className="menu-wrapper">
              <Button onClick={handleShow1} sx={{ marginRight: 1 }} variant="contained" endIcon={<AddCircleOutlineIcon />}>
                Criar Novo Centro
              </Button>
            </div>
            <div className="content-wrapper">
              <div className="card-wrapper row">
                {centroList?.map((centro, index) => (
                  <div className="card-item col-4" key={centro.id_centro}>
                    <Card className="card_centros" sx={{ height: "fit-content" }}>
                      <CardContent>
                        <Typography sx={{ fontWeight: "bold" }} gutterBottom variant="h5" component="div">
                          {"Centro de " + centro.nomecentro}
                        </Typography>
                        <Typography sx={{ padding: "1%" }} variant="body2" color="text.secondary" component="div">
                          {centro.activeStatus ? (
                            <div>
                              <span className="dot-active" /> Ativo{" "}
                            </div>
                          ) : (
                            <div>
                              <span className="dot-inactive" /> Inativo{" "}
                            </div>
                          )}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button sx={{ marginRight: "8px" }} href={"/editarCentro/" + centro.id_centro} size="small" variant="outlined" color="success">
                          Editar
                        </Button>
                        <Button
                          onClick={() => {
                            setCentrotoDelete(centro);
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
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Criar Centro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="nomeCentro">
                  <Form.Label>Nome Centro</Form.Label>
                  <Form.Control required type="text" placeholder="Introduza nome" onChange={(value) => setNomeCentro(value.target.value)} />
                  <Form.Control.Feedback type="invalid">Insira um nome.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Localização</Form.Label>
                  <Form.Select required defaultValue={0} onChange={(value) => setLocalizacao(value.target.value)}>
                    <option value={0}>Escolha uma Localização</option>
                    {listaLocalizacao?.map((localizacao, index) => (
                      <option key={index} value={localizacao.id_local}>
                        {localizacao.freguesia}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Criar Centro
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
            <Modal.Title style={{ color: "gray", fontsize: "25px", fontWeight: "bold" }}>Eliminar Centro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <div style={{ fontSize: "20px" }}> Tem a certeza que quer eliminar o centro de {centrotoDelete.nomecentro}?</div>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleDeleteCentro(centrotoDelete.id_centro)} sx={{ marginRight: 1 }} variant="outlined" color="success">
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

export default Centros;
