import React, { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import authHeader from "../../../services/auth-header";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";

const EditarLocalizacao = () => {
  const navigate = useNavigate();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [localizacaoID, setLocalizacaoID] = useState(useParams().id);

  const [freguesia, setFreguesia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [codigopostal, setCodigoPostal] = useState("");
  const [error, setError] = useState();

  function getCurrentUser() {
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function updateLocalData() {
    if (freguesia !== "" && distrito !== "" && codigopostal !== "") {
      const baseUrl = "https://softinsa-reunions-back.herokuapp.com/localizacoes/update/" + localizacaoID;
      const datapost = {
        freguesia: freguesia,
        distrito: distrito,
        codigopostal: codigopostal,
      };
      axios
        .put(baseUrl, datapost, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            alert("Alterado com sucesso.");
            window.location.reload();
          } else {
            alert("ERRO" + response.data.data);
          }
        })
        .catch((error) => {
          alert("Error 34 " + error);
        });
      navigate("/localizacoes");
    }
  }

  const checkSubmitValues = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    updateLocalData();
  };

  useEffect(() => {
    axios
      .get("https://softinsa-reunions-back.herokuapp.com/localizacoes/get/" + localizacaoID, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          setFreguesia(res.data.data.freguesia);
          setDistrito(res.data.data.distrito);
          setCodigoPostal(res.data.data.codigopostal);
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
        <Navbar title="Editar Localização" user={currentUser} />
        <div className="pageContent">
          <Form noValidate validated={validated} onSubmit={checkSubmitValues}>
            <Form.Group className="mb-3" controlId="nomeFreguesia">
              <Form.Label>Nome Freguesia</Form.Label>
              <Form.Control required type="text" placeholder="Introduza o nome da freguesia" value={freguesia} onChange={(value) => setFreguesia(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o nome da freguesia.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nomeDistrito">
              <Form.Label>Nome Distrito</Form.Label>
              <Form.Control required type="text" placeholder="Introduza o nome do distrito" value={distrito} onChange={(value) => setDistrito(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o nome do distrito.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="codigoPostal">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control required type="text" placeholder="Introduza o código postal (Ex: '1000-999')" value={codigopostal} onChange={(value) => setCodigoPostal(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira o código postal.</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Confirmar Alterações
            </Button>
            <Button href={"/localizacoes"} sx={{ marginRight: 1 }} variant="outlined" color="error">
              Cancelar{" "}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditarLocalizacao;
