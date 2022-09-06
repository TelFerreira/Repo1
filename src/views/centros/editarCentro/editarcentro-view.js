import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import authHeader from "../../../services/auth-header";
import AuthService from "../../../services/auth.service";
import "./editarcentro-view.css";

const EditarCentro = () => {
  const navigate = useNavigate();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [listaLocalizacao, setlistaLocalizacao] = useState([]);
  const [centroID, setcentroID] = useState(useParams().id);
  const [centroName, setcentroName] = useState("");
  const [centroLocalizacao, setcentroLocalizacao] = useState(0);
  const [activeStatus, setactiveStatus] = useState(false);
  const [error, setError] = useState();

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

  async function updateCentroStatus(activeStatus) {
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/centros/updateStatus/" + centroID;
    const datapost = {
      activeStatus: activeStatus,
    };
    await axios
      .put(baseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert("Alteração de status com sucesso.");
          navigate("/centros");
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
    navigate("/centros");
  }

  function updateCentroData() {
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/centros/update/" + centroID;
    const datapost = {
      nomecentro: centroName,
      id_local: centroLocalizacao,
    };
    axios
      .put(baseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert("Alterado com sucesso.");
          window.location.reload();
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
    navigate("/centros");
  }

  useEffect(() => {
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

    axios
      .get("https://backend-pint2022.herokuapp.com/centros/get/" + centroID, {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setcentroName(res.data.data.nomecentro);
          setactiveStatus(res.data.data.activeStatus);
          setcentroLocalizacao(res.data.data.id_local);
        } else {
          setError(res.data.data);
        }
      })
      .catch((error) => {
        setError(error.data.data);
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
      <Navbar title="Editar Centro" user={currentUser} />
      <h2 className="text-center mt-5">Alterar Centro</h2>
      <Form
        className="d-flex flex-column mx-auto"
        style={{ width: "fit-content", minWidth: "500px" }}
        noValidate
        validated={validated}
      >
        <Form.Group className="mb-3" controlId="nomeCentro">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Nome"
            value={centroName}
            onChange={(value) => setcentroName(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Localização</Form.Label>
          <Form.Select
            required
            value={centroLocalizacao}
            onChange={(value) => setcentroLocalizacao(value.target.value)}
          >
            <option value={0}>Escolha uma Localização</option>
            {listaLocalizacao?.map((localizacao, index) => (
              <option key={index} value={localizacao.id_local}>
                {localizacao.freguesia}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="d-flex gap-2">
          {activeStatus ? (
            <button
              className="btn btn-warning h-50"
              style={{ width: "fit-content" }}
              onClick={() => updateCentroStatus(false)}
            >
              Inativar
            </button>
          ) : (
            <button
              className="btn btn-success h-50"
              style={{ width: "fit-content" }}
              onClick={() => updateCentroStatus(true)}
            >
              Ativar
            </button>
          )}
          <a className="btn btn-danger h-50" href={"/centros"}>
            Cancelar
          </a>
          <button
            className="btn btn-success h-50"
            onClick={() => updateCentroData()}
            type="submit"
          >
            Confirmar Alterações
          </button>
        </div>
      </Form>
    </>
  );
};

export default EditarCentro;
