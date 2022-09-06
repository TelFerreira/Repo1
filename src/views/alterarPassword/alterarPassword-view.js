import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";

const AlterarPassword = () => {
  const navigate = useNavigate();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmnewPassword, setConfirmNewPassword] = useState("");

  const [greenmessage, setGreenMessage] = useState("");
  const [redmessage, setRedMessage] = useState("");

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

  const checkSubmitValues = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    updatePassword();
  };

  function updatePassword() {
    if (newPassword.trim() !== "" && confirmnewPassword.trim() !== "") {
      if (newPassword.trim() === confirmnewPassword.trim()) {
        const baseUrl =
          "https://backend-pint2022.herokuapp.com/user/updatePasswordFirstLogin/" +
          currentUser.id_utilizador;
        const datapost = {
          password: newPassword.trim(),
          passwordprecisaupdate: false,
        };
        axios
          .put(baseUrl, datapost, { headers: authHeader() })
          .then((response) => {
            if (response.data.success) {
              setRedMessage("");
              setGreenMessage("Password alterada com sucesso. ");
            } else {
              setGreenMessage("");
              setRedMessage("Erro a alterar a password. Tente novamente");
            }
          })
          .catch((error) => {
            alert("Error 34 " + error);
          });
      } else {
        setGreenMessage("");
        setRedMessage("As passwords não são iguais!");
      }
    }
  }

  useEffect(() => {
    getCurrentUser();
    isUserLogged();
  }, []);

  return (
    <>
      <Navbar />
      <h2 className="text-center mt-5">Alterar Password</h2>
      <Form
        className="d-flex flex-column mt-3"
        style={{
          width: "fit-content",
          marginInline: "auto",
          minWidth: "500px",
        }}
        id="input-form"
        noValidate
        validated={validated}
        onSubmit={checkSubmitValues}
      >
        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={(value) => setNewPassword(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmarPassword">
          <Form.Control
            required
            type="password"
            placeholder="Repetir Password"
            onChange={(value) => setConfirmNewPassword(value.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Campo Obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex gap-2 mx-auto">
          <button
            className="btn btn-danger h-50"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
            type="submit"
          >
            Voltar
          </button>
          <button
            className="btn btn-success h-50"
            style={{ width: "fit-content" }}
            onClick={() => updatePassword()}
            type="submit"
          >
            Confirmar
          </button>
        </div>

        {greenmessage && (
          <div className="form-group">
            <div
              style={{
                width: "40%",
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
                {greenmessage}
              </div>
            </div>
          </div>
        )}
        {redmessage && (
          <div className="form-group">
            <div
              style={{
                width: "40%",
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
                {redmessage}
              </div>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};

export default AlterarPassword;
