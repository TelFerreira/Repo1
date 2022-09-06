import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import authHeader from "../../../services/auth-header";
import AuthService from "../../../services/auth.service";

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

  function updateLocalData() {
    if (freguesia !== "" && distrito !== "" && codigopostal !== "") {
      const baseUrl =
        "https://backend-pint2022.herokuapp.com/localizacoes/update/" +
        localizacaoID;
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
      .get(
        "https://backend-pint2022.herokuapp.com/localizacoes/get/" +
          localizacaoID,
        { headers: authHeader() }
      )
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
      <Navbar title="Editar Localização" user={currentUser} />
      <h2 className="text-center mt-5">Alterar Localização</h2>
      <Form
        className="d-flex flex-column mx-auto"
        style={{ width: "fit-content", minWidth: "500px" }}
        noValidate
        validated={validated}
        onSubmit={checkSubmitValues}
      >
        <Form.Group className="mb-3" controlId="nomeFreguesia">
          <Form.Control
            required
            type="text"
            placeholder="Freguesia"
            value={freguesia}
            onChange={(value) => setFreguesia(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="nomeDistrito">
          <Form.Control
            required
            type="text"
            placeholder="Distrito"
            value={distrito}
            onChange={(value) => setDistrito(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="codigoPostal">
          <Form.Control
            required
            type="text"
            placeholder="Código postal (0000-000)"
            value={codigopostal}
            onChange={(value) => setCodigoPostal(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>
        <div
          className="d-flex gap-2"
          style={{ width: "fit-content", marginLeft: "auto" }}
        >
          <a
            className="btn btn-danger h-50"
            style={{ width: "fit-content" }}
            href={"/localizacoes"}
          >
            Cancelar
          </a>
          <button
            className="btn btn-success h-50"
            style={{ width: "fit-content" }}
            type="submit"
          >
            Confirmar Alterações
          </button>
        </div>
      </Form>
    </>
  );
};

export default EditarLocalizacao;
