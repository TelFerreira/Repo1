import React, { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import authHeader from "../../../services/auth-header";
import "./editarSala-view.css";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";

const EditarSala = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [error, setError] = useState();

  //Get Sala Data
  const [salaID, setSalaID] = useState(useParams().id);
  const [nomeSala, setNomeSala] = useState("");
  const [descricao, setDescricao] = useState("");
  const [alocacaoMaxima, setAlocacaoMaxima] = useState("");
  const [percentAlocacao, setPercentAlocacao] = useState("");
  const [tempoLimpeza, setTempoLimpeza] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);
  const [idCentro, setIdCentro] = useState(false);
  const [listacentro, setListaCentro] = useState([]);

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

  async function updateSalaStatus(activeStatus) {
    const baseUrl =
      "https://backend-pint2022.herokuapp.com/salas/updateStatus/" + salaID;
    const datapost = {
      activeStatus: activeStatus,
    };
    await axios
      .put(baseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert("Alterado status com sucesso.");
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error 34 " + error);
      });
    navigate("/salas");
  }

  function updateSalaData() {
    if (
      nomeSala !== "" &&
      descricao !== "" &&
      alocacaoMaxima !== "" &&
      percentAlocacao !== "" &&
      tempoLimpeza !== "" &&
      idCentro !== ""
    ) {
      const baseUrl =
        "https://backend-pint2022.herokuapp.com/salas/update/" + salaID;
      const datapost = {
        nomesala: nomeSala,
        descricao: descricao,
        alocacao_maxima: alocacaoMaxima,
        alocacao_percent: percentAlocacao,
        tempo_limpeza: tempoLimpeza,
        id_centro: idCentro,
      };
      axios
        .put(baseUrl, datapost, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            alert("Alterada com sucesso.");
            window.location.reload();
          } else {
            alert("ERRO" + response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
      navigate("/salas");
    }
  }

  const checkSubmitValues = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    updateSalaData();
  };

  useEffect(() => {
    //Get informa????o da sala a editar
    axios
      .get("https://backend-pint2022.herokuapp.com/salas/get/" + salaID, {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.data.success) {
          setNomeSala(res.data.data.nomesala);
          setDescricao(res.data.data.descricao);
          setAlocacaoMaxima(res.data.data.alocacao_maxima);
          setPercentAlocacao(res.data.data.alocacao_percent);
          setTempoLimpeza(res.data.data.tempo_limpeza);
          setActiveStatus(res.data.data.activeStatus);
          setIdCentro(res.data.data.id_centro);
        } else {
          setError(res.data.data);
        }
      })
      .catch((error) => {
        setError(error.data.data);
      });

    //Get lista de centros disponiveis
    axios
      .get("https://backend-pint2022.herokuapp.com/centros/listActiveCenters", {
        headers: authHeader(),
      })
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
      <Navbar title={"Editar Sala"} user={currentUser} />
      <h2 className="text-center mt-5">Alterar Sala</h2>

      <Form
        className="d-flex flex-column mt-3"
        style={{
          width: "fit-content",
          marginInline: "auto",
          minWidth: "500px",
        }}
        noValidate
        validated={validated}
        onSubmit={checkSubmitValues}
      >
        <Form.Group className="mb-3" controlId="nomeSala">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Introduza nome"
            value={nomeSala}
            onChange={(value) => setNomeSala(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigat??rio.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="descricao">
          <Form.Label>Descri????o</Form.Label>
          <Form.Control
            required
            type="text"
            as="textarea"
            placeholder="Descri????o"
            value={descricao}
            onChange={(value) => setDescricao(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigat??rio.
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex gap-2">
          <Form.Group className="mb-3 w-100" controlId="alocacaoMaxima">
            <Form.Label>Aloca????o M??xima</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Aloca????o M??xima"
              value={alocacaoMaxima}
              onChange={(value) => setAlocacaoMaxima(value.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Campo Obrigat??rio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 w-100" controlId="percentAlocacao">
            <Form.Label>Aloca????o Permitida (%)</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Aloca????o Permitida (%)"
              value={percentAlocacao}
              onChange={(value) => setPercentAlocacao(value.target.value)}
            />

            <Form.Control.Feedback type="invalid">
              Campo Obrigat??rio.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <Form.Group className="mb-3" controlId="tempoLimpeza">
          <Form.Label>Tempo Limpeza</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Tempo de limpeza"
            value={tempoLimpeza}
            onChange={(value) => setTempoLimpeza(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigat??rio.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select
            required
            value={idCentro}
            onChange={(value) => setIdCentro(value.target.value)}
          >
            <option defaultValue={0}>Centro</option>
            {listacentro?.map((centro, index) => (
              <option key={index} value={centro.id_centro}>
                {centro.nomecentro}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="d-flex gap-2">
          {activeStatus ? (
            <button
              className="btn btn-warning h-50"
              style={{ width: "fit-content" }}
              onClick={() => updateSalaStatus(false)}
            >
              Inativar
            </button>
          ) : (
            <button
              className="btn btn-success h-50"
              style={{ width: "fit-content" }}
              onClick={() => updateSalaStatus(true)}
            >
              Ativar
            </button>
          )}
          <a className="btn btn-danger h-50" href={"/salas"}>
            Cancelar
          </a>
          <button className="btn btn-success h-50" type="submit">
            Confirmar Altera????es
          </button>
        </div>
      </Form>
    </>
  );
};

export default EditarSala;
