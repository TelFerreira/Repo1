import React, { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import authHeader from "../../../services/auth-header";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";

const EditarUtilizador = () => {
  const navigate = useNavigate();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [utilizadorID, setUtilizadorID] = useState(useParams().id);

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);
  const [idCentro, setIdCentro] = useState(0);
  const [idTipoUtilizador, setIdTipoUtilizador] = useState(0);
  const [idpermissao, setIdpermissao] = useState(0);

  const [listacentro, setListaCentro] = useState([]);
  const [listatipoUtilizador, setListatipoUtilizador] = useState([]);
  const [listapermissao, setListaPermissoes] = useState([]);

  const [error, setError] = useState();

  function getCurrentUser() {
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function updateUtilizadorStatus(activeStatus) {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/user/updateStatus/" + utilizadorID;
    const datapost = {
      activeStatus: activeStatus,
    };
    axios
      .put(baseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
    navigate("/utilizadores");
  }

  function updateUtilizadorData() {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/user/update/" + utilizadorID;
    if (primeiroNome !== "" && sobrenome !== "" && idCentro !== "" && idTipoUtilizador !== "" && idpermissao !== "") {
      const datapost = {
        primeironome: primeiroNome,
        sobrenome: sobrenome,
        id_centro: idCentro,
        id_tipoUtilizador: idTipoUtilizador,
        id_permissao: idpermissao,
      };
      axios
        .put(baseUrl, datapost, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
          } else {
            alert(response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
      navigate("/utilizadores");
    }
  }

  const checkSubmitValues = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    updateUtilizadorData();
  };

  useEffect(() => {
    axios
      .get("https://softinsa-reunions-back.herokuapp.com/user/getByID/" + utilizadorID, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          setPrimeiroNome(res.data.data.primeironome);
          setSobrenome(res.data.data.sobrenome);
          setEmail(res.data.data.email);
          setActiveStatus(res.data.data.activeStatus);
          setIdCentro(res.data.data.id_centro);
          setIdTipoUtilizador(res.data.data.id_tipoUtilizador);
          setIdpermissao(res.data.data.id_permissao);
        } else {
          setError(res.data.data);
        }
      })
      .catch((error) => {
        setError(error.data.data);
      });

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

    axios
      .get("https://softinsa-reunions-back.herokuapp.com/permissoes/list", { headers: authHeader() })
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

    axios
      .get("https://softinsa-reunions-back.herokuapp.com/tipoUtilizador/list", { headers: authHeader() })
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
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar title="Editar Utilizador" user={currentUser} />
        <div className="pageContent">
          <Form noValidate validated={validated} onSubmit={checkSubmitValues}>
            <Form.Group className="mb-3" controlId="primeiroNome">
              <Form.Label>Primeiro nome</Form.Label>
              <Form.Control required type="text" placeholder="Introduza o seu primeiro nome" value={primeiroNome} onChange={(value) => setPrimeiroNome(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o seu primeiro nome.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sobrenome">
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control required type="text" placeholder="Introduza o seu sobrenome" value={sobrenome} onChange={(value) => setSobrenome(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o seu sobrenome.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email (não pode alterar)</Form.Label>
              <Form.Control disabled type="text" placeholder="Introduza o seu email" value={email} onChange={(value) => setEmail(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o seu email.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Centro</Form.Label>
              <Form.Select required value={idCentro} onChange={(value) => setIdCentro(value.target.value)}>
                <option value={0}>Escolha um Centro</option>
                {listacentro?.map((centro, index) => (
                  <option key={index} value={centro.id_centro}>
                    {centro.nomecentro}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo Utilizador</Form.Label>
              <Form.Select required value={idTipoUtilizador} onChange={(value) => setIdTipoUtilizador(value.target.value)}>
                <option value={0}>Escolha um tipo de utilizador</option>
                {listatipoUtilizador?.map((tipoUtilizador, index) => (
                  <option key={index} value={tipoUtilizador.id_tipoUtilizador}>
                    {tipoUtilizador.descricao}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Permissões Utilizador</Form.Label>
              <Form.Select required value={idpermissao} onChange={(value) => setIdpermissao(value.target.value)}>
                <option value={0}>Escolha um tipo de permissão</option>
                {listapermissao?.map((permissao, index) => (
                  <option key={index} value={permissao.id_permissao}>
                    {permissao.descricao}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {activeStatus ? (
              <Button onClick={() => updateUtilizadorStatus(false)} sx={{ marginRight: 1 }} variant="outlined" color="secondary">
                Inativar
              </Button>
            ) : (
              <Button onClick={() => updateUtilizadorStatus(true)} sx={{ marginRight: 1 }} variant="outlined" color="secondary">
                Ativar
              </Button>
            )}
            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Confirmar Alterações
            </Button>
            <Button href={"/utilizadores"} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Cancelar
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditarUtilizador;
