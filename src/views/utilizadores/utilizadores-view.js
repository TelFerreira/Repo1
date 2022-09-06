import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { register } from "../../actions/auth";
import Navbar from "../../components/Navbar";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";
import "./utilizadores-view.css";

const Utilizadores = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

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

  const [show5, setShow5] = useState(false);
  const handleShow5 = () => setShow5(true);
  const handleClose5 = () => setShow5(false);

  const [userList, setuserList] = useState();
  const [error, setError] = useState("");

  const [validated, setValidated] = useState(false);

  const [utilizadortoDelete, setUtilizadortoDelete] = useState("");

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [listacentro, setListaCentro] = useState([]);
  const [centro, setCentro] = useState([]);

  const [listapermissao, setListaPermissoes] = useState([]);
  const [permissao, setPermissao] = useState([]);

  const [listatipoUtilizador, setListatipoUtilizador] = useState([]);
  const [tipoUtilizador, settipoUtilizador] = useState([]);

  const [bulkSuccess, setBulkSuccess] = useState("");
  const [bulkError, setBulkError] = useState("");

  function handleSubmit() {
    if (nome !== "" && sobrenome !== "" && email !== "" && password !== "") {
      dispatch(
        register(
          nome,
          sobrenome,
          email,
          password,
          true,
          false,
          true,
          centro,
          tipoUtilizador,
          permissao
        )
      )
        .then(() => {
          handleClose1();
          handleShow3();
        })
        .catch((error) => {
          handleClose1();
          handleShow4();
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

  function handleDeleteUtilizador(idtoDelete) {
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/user/delete/" + idtoDelete;
    axios
      .delete(baseUrl, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          handleClose2();
          handleShow5();
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
  }

  function checkValidRow(data) {
    if (
      data.email &&
      data.sobrenome &&
      data.email &&
      data.password &&
      data.id_permissao &&
      data.id_tipoUtilizador
    )
      return true;
    else return false;
  }

  function sendToAPI(data) {
    dispatch(
      register(
        data.primeironome,
        data.sobrenome,
        data.email,
        data.password.toString(),
        true,
        false,
        true,
        data.id_centro,
        data.id_tipoUtilizador,
        data.id_permissao
      )
    )
      .then(() => {
        setBulkSuccess("Bulk inserido com sucesso. Clique no botão continuar");
        setBulkError("");
      })
      .catch((error) => {
        setBulkError(
          "Erro ao inserir em bulk. Confirme o correto preenchimento do Excel"
        );
        setBulkSuccess("");
      });
  }

  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    let data = [];

    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
      for (var i = 0; i < data.length; i++) {
        if (checkValidRow(data[i])) {
          sendToAPI(data[i]);
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
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

    function getUserList() {
      axios
        .get("https://backend-pint2022.herokuapp.com/user/list", {
          headers: authHeader(),
        })
        .then((res) => {
          if (res.data.success) {
            setuserList(res.data.data);
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

    function getPermissoesData() {
      axios
        .get("https://backend-pint2022.herokuapp.com/permissoes/list", {
          headers: authHeader(),
        })
        .then((res) => {
          if (res.data.success) {
            setListaPermissoes(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }

    function getTipoUtilizadoresData() {
      axios
        .get("https://backend-pint2022.herokuapp.com/tipoUtilizador/list", {
          headers: authHeader(),
        })
        .then((res) => {
          if (res.data.success) {
            setListatipoUtilizador(res.data.data);
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

    getCentrosData();
    getPermissoesData();
    getTipoUtilizadoresData();
    getCurrentUser();
    isUserLogged();
    getUserList();
  }, []);

  return (
    <>
      <Navbar title="Utilizadores" user={currentUser} />
      <div className="d-flex gap-2 w-25 my-2 mx-auto">
        <button className="btn btn-primary h-100" onClick={handleShow1}>
          Criar
        </button>
        <button
          className="btn btn-primary h-100"
          onClick={() => fileRef.current.click()}
        >
          Bulk Insert
        </button>
        <input
          ref={fileRef}
          onChange={onChange}
          multiple={false}
          type="file"
          hidden
          accept=".xlsx, .xls, .csv"
        />
        {bulkSuccess && (
          <div className="form-group">
            <div
              style={{
                width: "100%",
                textAlign: "center",
                paddingTop: "1%",
              }}
              className="alerts-wrapper"
            >
              <div
                style={{ fontSize: "18px" }}
                className="alert alert-success"
                role="alert"
              >
                {bulkSuccess}
              </div>
            </div>
          </div>
        )}
        {bulkError && (
          <div className="form-group">
            <div
              style={{
                width: "100%",
                textAlign: "center",
                paddingTop: "1%",
              }}
              className="alerts-wrapper"
            >
              <div
                style={{ fontSize: "18px" }}
                className="alert alert-danger"
                role="alert"
              >
                {bulkError}
              </div>
            </div>
          </div>
        )}
      </div>
      <Table className="w-75 mx-auto" striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Permissões</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((user, index) => (
            <tr>
              <td>{user.primeironome + " " + user.sobrenome}</td>
              <td>{user.email}</td>
              <td>
                {user.id_tipoUtilizador === 1 ? "Administrador" : "Funcionário"}
              </td>
              <td>
                {user.activeStatus ? (
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
                    sx={{ marginRight: "8px" }}
                    href={"/editarUtilizador/" + user.id_utilizador}
                  >
                    Editar
                  </a>
                  <button
                    className="btn btn-danger h-100"
                    onClick={() => {
                      setUtilizadortoDelete(user);
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
            <Modal.Title>Novo Utilizador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nome">
              <Form.Control
                required
                type="text"
                placeholder="Nome"
                onChange={(value) => setNome(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sobrenome">
              <Form.Control
                required
                type="text"
                placeholder="Sobrenome"
                onChange={(value) => setSobrenome(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                required
                type="text"
                placeholder="Email"
                onChange={(value) => setEmail(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                onChange={(value) => setPassword(value.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Campo Obrigatório.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                required
                defaultValue={0}
                onChange={(value) => setCentro(value.target.value)}
              >
                <option value={0}>Centro</option>
                {listacentro?.map((centro, index) => (
                  <option key={index} value={centro.id_centro}>
                    {centro.nomecentro}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                defaultValue={0}
                onChange={(value) => settipoUtilizador(value.target.value)}
              >
                <option value={0}>Tipo</option>
                {listatipoUtilizador?.map((tipoUtilizador, index) => (
                  <option key={index} value={tipoUtilizador.id_tipoUtilizador}>
                    {tipoUtilizador.descricao}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                defaultValue={0}
                onChange={(value) => setPermissao(value.target.value)}
              >
                <option value={0}>Permissão</option>
                {listapermissao?.map((permissao, index) => (
                  <option key={index} value={permissao.id_permissao}>
                    {permissao.descricao}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success h-50"
                onClick={checkSubmitValues}
              >
                Criar
              </button>
              <button className="btn btn-danger h-50" onClick={handleClose1}>
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
              Eliminar Utilizador
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-modal" style={{ height: "fit-content" }}>
              <Card.Body>
                <div style={{ fontSize: "20px" }}>
                  {" "}
                  Tem a certeza que quer eliminar o utilizador{" "}
                  {utilizadortoDelete.primeironome +
                    " " +
                    utilizadortoDelete.sobrenome}
                  ?
                </div>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() =>
                handleDeleteUtilizador(utilizadortoDelete.id_utilizador)
              }
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
            Utilizador criado com sucesso.
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
            Erro ao criar o utilizador .
          </h5>
        </Modal.Body>
      </Modal>

      <Modal
        show={show5}
        onHide={() => {
          handleClose5();
          window.location.reload();
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Body style={{ backgroundColor: "light-green", border: "0" }}>
          <h5 style={{ display: "flex", justifyContent: "center" }}>
            Utilizador eliminado com sucesso.
          </h5>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Utilizadores;
