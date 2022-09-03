import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authHeader from "../../services/auth-header";
import "./reservas-view.css";
import Tabela from "./tabela";
import { Form } from "react-bootstrap";

const Reservas = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  const [error, setError] = useState("");

  const [inicioData, setInicioData] = useState(new Date().toISOString().slice(0, 10));
  const [fimData, setFimData] = useState(dayPlusSeven(new Date()).toISOString().slice(0, 10));

  const [listaCentros, setListaCentros] = useState([]);
  const [centroEscolhido, setCentroEscolhido] = useState("");

  function resetData() {
    setInicioData(new Date().toISOString().slice(0, 10));
    setFimData(dayPlusSeven(new Date()).toISOString().slice(0, 10));
    setCentroEscolhido(0);
    document.getElementById("escolhaCentro").value = 0;
  }

  /// usa date format
  function dayPlusSeven(dia) {
    dia.setDate(dia.getDate() + 7);
    return dia;
  }

  async function getCurrentUser() {
    if (storageUser) {
      await AuthService.getCurrentUser(storageUser.token).then((response) => setcurrentUser(response));
    }
  }

  function isUserLogged() {
    if (!storageUser) {
      navigate("/login");
    }
  }

  useEffect(() => {
    function getCentrosData() {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/centros/list", { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            setListaCentros(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }

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
    getCentrosData();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar title="Reservas" user={currentUser} />
          <div className="pageContent">
            <div className="featuredInfoContainer" style={{ justifyContent: "space-evenly", alignItems: "baseline" }}>
              <div>
                Inicio:
                <input type="date" className="camposInput" id="qtyReservaStart" max={fimData} onChange={(value) => setInicioData(value.target.value)} value={inicioData} />
              </div>
              <div>
                Fim:
                <input type="date" className="camposInput" id="qtyReservaEnd" min={inicioData} onChange={(value) => setFimData(value.target.value)} value={fimData} />
              </div>
              <Form.Group className="mb-3" style={{ display: "flex", alignItems: "center" }}>
                <label className="camposInput">Centro:</label>
                <Form.Select id="escolhaCentro" required defaultValue={0} onChange={(value) => setCentroEscolhido(value.target.value)}>
                  <option value={0}>Nenhum</option>
                  {listaCentros?.map((centro, index) =>
                    centro.activeStatus ? (
                      <option key={centro.id_centro} value={centro.id_centro}>
                        {centro.nomecentro}
                      </option>
                    ) : (
                      <option className="inativo" key={centro.id_centro} value={centro.id_centro}>
                        {centro.nomecentro}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>
              <Button variant="outlined" color="error" onClick={() => resetData()}>
                Eliminar Filtros
              </Button>
            </div>
            <div className="nota">
              <Tabela dataIncial={inicioData} dataFinal={fimData} idCentro={centroEscolhido} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservas;
