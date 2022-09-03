import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import Navbar from "../../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth-header";
import Sidebar from "../../components/Sidebar";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";

const AlterarPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [validated, setValidated] = useState(false);

  const [utilizadorID, setUtilizadorID] = useState(useParams().id);
  const [error, setError] = useState();

  const [newPassword, setNewPassword] = useState("");
  const [confirmnewPassword, setConfirmNewPassword] = useState("");

  const [greenmessage, setGreenMessage] = useState("");
  const [redmessage, setRedMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function getCurrentUser() {
    if (storageUser) AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  function clearFormData() {
    document.getElementById("input-form").reset();
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
    if (newPassword !== "" && confirmnewPassword !== "") {
      if (newPassword == confirmnewPassword) {
        const baseUrl = "https://softinsa-reunions-back.herokuapp.com/user/updatePasswordFirstLogin/" + currentUser.id_utilizador;
        const datapost = {
          password: newPassword,
          passwordprecisaupdate: false,
        };
        axios
          .put(baseUrl, datapost, { headers: authHeader() })
          .then((response) => {
            if (response.data.success) {
              setRedMessage("");
              setGreenMessage("Password alterada com sucesso. Já pode utilizar a aplicação.");
            } else {
              setGreenMessage("");
              setRedMessage("Erro ao alterar a password. Tente novamente");
            }
          })
          .catch((error) => {
            alert("Error 34 " + error);
          });
      } else {
        setGreenMessage("");
        setRedMessage("As passwords devem coincidir. Volte a digitir ambas");
      }
    }
  }

  useEffect(() => {
    getCurrentUser();
    isUserLogged();

    const baseUrl = "https://softinsa-reunions-back.herokuapp.com/user/passwordNeedsUpdate/" + storageUser.token;
    axios
      .post(baseUrl, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          setTitle("Bem vindo ao Softinsa-Reunions");
          setDescription("Para poder continuar e ter acesso às restantes funcionalidades vamos pedir-lhe que altere a sua password.");
        } else {
          setTitle("Alterar password");
          setDescription("Defina uma password segura.");
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar title={title} user={currentUser} />
        <div className="pageContent">
          <div style={{ color: "red" }} className="textInformation">
            <h6> {description}</h6>
          </div>
          <Form id="input-form" style={{ paddingTop: "1%" }} noValidate validated={validated} onSubmit={checkSubmitValues}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Introduza password" onChange={(value) => setNewPassword(value.target.value)} />
              <Form.Control.Feedback type="invalid">Insira uma password.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarPassword">
              <Form.Label>Confirmar Password</Form.Label>
              <Form.Control required type="password" placeholder="Introduza novamente a  password" onChange={(value) => setConfirmNewPassword(value.target.value)} />
              <Form.Control.Feedback type="invalid">Confirme a sua password.</Form.Control.Feedback>
            </Form.Group>

            <Button onClick={() => updatePassword()} type="submit" sx={{ marginRight: 1 }} variant="outlined" color="success">
              Confirmar Alterações
            </Button>

            {greenmessage && (
              <div className="form-group">
                <div style={{ width: "40%", textAlign: "center", paddingTop: "1%" }} className="alerts-wrapper">
                  <div style={{ fontSize: "18px" }} className="alert alert-success" role="alert">
                    {greenmessage}
                  </div>
                </div>
              </div>
            )}
            {redmessage && (
              <div className="form-group">
                <div style={{ width: "40%", textAlign: "center", paddingTop: "1%" }} className="alerts-wrapper">
                  <div style={{ fontSize: "18px" }} className="alert alert-danger" role="alert">
                    {redmessage}
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AlterarPassword;
