import React, { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./editarcentro-view.css";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import authHeader from "../../../services/auth-header";

const EditarCentro = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  async function updateCentroStatus(activeStatus) {
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/centros/updateStatus/" + centroID;
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
    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/centros/update/" + centroID;
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

    axios
      .get("https://softinsa-reunions-back.herokuapp.com/centros/get/" + centroID, { headers: authHeader() })
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
        <Navbar title="Editar Centro" user={currentUser} />
        <div className="pageContent">
          <Form noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="nomeCentro">
              <Form.Label>Nome Centro</Form.Label>
              <Form.Control required type="text" placeholder="Introduza nome" value={centroName} onChange={(value) => setcentroName(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira um nome.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Localização</Form.Label>
              <Form.Select required value={centroLocalizacao} onChange={(value) => setcentroLocalizacao(value.target.value)}>
                <option value={0}>Escolha uma Localização</option>
                {listaLocalizacao?.map((localizacao, index) => (
                  <option key={index} value={localizacao.id_local}>
                    {localizacao.freguesia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {activeStatus ? (
              <Button onClick={() => updateCentroStatus(false)} sx={{ marginRight: 1 }} variant="outlined" color="secondary">
                Inativar
              </Button>
            ) : (
              <Button onClick={() => updateCentroStatus(true)} sx={{ marginRight: 1 }} variant="outlined" color="secondary">
                Ativar
              </Button>
            )}
            <Button onClick={() => updateCentroData()} type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Confirmar Alterações
            </Button>
            <Button href={"/centros"} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Cancelar
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditarCentro;
