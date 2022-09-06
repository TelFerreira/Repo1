import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal, Alert, Table } from "react-bootstrap";
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
      await AuthService.getCurrentUser(storageUser.token).then((response) =>
        setcurrentUser(response)
      );
    }
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function handleSubmit() {
    if (nomeFreguesia !== "" || nomeDistrito !== "" || codigoPostal !== "") {
      const baseUrl =
        "https://backend-pint2022.herokuapp.com/localizacoes/register";
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
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/localizacoes/delete/" +
      idtoDelete;
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
      .get("https://backend-pint2022.herokuapp.com/localizacoes/list", {
        headers: authHeader(),
      })
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
  }, []);

  return (
    <>
      <Navbar title="Localizações" user={currentUser} />
      <div className="d-flex gap-2 w-25 my-2 mx-auto">
        <button className="btn btn-primary h-100" onClick={handleShow1}>
          Criar
        </button>
      </div>
      <Table className="w-50 mx-auto" striped bordered hover>
        <thead>
          <tr>
            <th>Localização</th>
            <th>Código Postal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {localizacaoList?.map((localizacao, index) => (
            <tr>
              <td>{localizacao.freguesia}</td>
              <td>{localizacao.codigopostal}</td>
              <td>
                <div className="d-flex w-50 gap-2">
                  <a
                    className="btn btn-primary h-100"
                    sx={{ marginRight: "8px" }}
                    href={"/editarLocal/" + localizacao.id_local}
                  >
                    Editar
                  </a>
                  <button
                    className="btn btn-danger h-100"
                    onClick={() => {
                      setLocaltoDelete(localizacao);
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
            <Modal.Title style={{ fontsize: "25px", fontWeight: "bold" }}>
              Nova Localização
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nomeFreguesia">
              <Form.Control
                required
                type="text"
                placeholder="Freguesia"
                onChange={(value) => setNomeFreguesia(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Insira o nome da freguesia.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nomeDistrito">
              <Form.Control
                required
                type="text"
                placeholder="Distrito"
                onChange={(value) => setNomeDistrito(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Insira o nome do distrito.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="codigoPostal">
              <Form.Control
                required
                type="text"
                placeholder="Código Postal (ex: 99999-999)"
                onChange={(value) => setCodigoPostal(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Insira o código postal.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary h-100"
                type="submit"
                sx={{ marginRight: 1 }}
              >
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
          <Modal.Body>
            <div className="h3">
              Tem a certeza que quer eliminar "{localtoDelete.freguesia}" da
              lista de localizações?
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button
                className="btn btn-warning h-100"
                onClick={() => handleDeleteLocal(localtoDelete.id_local)}
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

      <Modal
        show={show3}
        onHide={() => {
          handleClose3();
          window.location.reload();
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Body style={{ backgroundColor: "light-green", border: "0" }}>
          <h5 style={{ display: "flex", justifyContent: "center" }}>
            Localização eliminada com sucesso.
          </h5>
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
          <h5 style={{ display: "flex", justifyContent: "center" }}>
            Localização inserida com sucesso.
          </h5>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Centros;
