import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Form, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";
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
    if (nomeCentro !== "" || localizacao !== "") {
      const baseUrl = "https://backend-pint2022.herokuapp.com/centros/register";
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
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/centros/delete/" + idtoDelete;
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
        .get("https://backend-pint2022.herokuapp.com/centros/list", {
          headers: authHeader(),
        })
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
        .get("https://backend-pint2022.herokuapp.com/localizacoes/list", {
          headers: authHeader(),
        })
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
      <Navbar title="Centros" user={currentUser} />
      <div className="d-flex gap-2 w-25 my-2 mx-auto">
        <button className="btn btn-primary h-100" onClick={handleShow1}>
          Criar
        </button>
      </div>
      <Table className="w-50 mx-auto" striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {centroList?.map((centro, index) => (
            <tr>
              <td>{centro.nomecentro}</td>
              <td>
                {centro.activeStatus ? (
                  <div>
                    <span className="dot-active" /> Ativo{" "}
                  </div>
                ) : (
                  <div>
                    <span className="dot-inactive" /> Inativo{" "}
                  </div>
                )}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <a
                    className="btn btn-primary h-100"
                    href={"/editarCentro/" + centro.id_centro}
                  >
                    Editar
                  </a>
                  <button
                    className="btn btn-danger h-100"
                    onClick={() => {
                      setCentrotoDelete(centro);
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
          <Modal.Header closebutton>
            <Modal.Title>Novo Centro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nomeCentro">
              <Form.Control
                required
                type="text"
                placeholder="Nome"
                onChange={(value) => setNomeCentro(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Select
                required
                defaultValue={0}
                onChange={(value) => setLocalizacao(value.target.value)}
              >
                <option value={0} hidden>
                  Localização
                </option>
                {listaLocalizacao?.map((localizacao, index) => (
                  <option key={index} value={localizacao.id_local}>
                    {localizacao.freguesia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button className="btn btn-success h-100" type="submit">
                Criar
              </button>
              <button className="btn btn-danger h-100" onClick={handleClose1}>
                Voltar
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={show2} onHide={handleClose2} dialogClassName="modal-90w">
        <Form>
          <Modal.Header closebutton>
            <Modal.Title>Eliminar Centro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              Tem a certeza que quer eliminar {centrotoDelete.nomecentro} da
              lista de centros?
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button
                className="btn btn-warning h-100"
                onClick={() => handleDeleteCentro(centrotoDelete.id_centro)}
              >
                Eliminar
              </button>
              <button className="btn btn-danger h-100" onClick={handleClose2}>
                Fechar
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Centros;
