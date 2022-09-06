import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import "./dashboard-view.css";
import Sidebar from "../../components/Sidebar/index";
import Navbar from "../../components/Navbar/index";
import axios from "axios";
import authHeader from "../../services/auth-header";
import Button from "@mui/material/Button";
import { Card, Form, FormGroup, Modal } from "react-bootstrap";
import { FcBusinessman, FcDepartment, FcTemplate } from "react-icons/fc";

import NumeroReservas from "../../components/Charts/numeroReservasByDate";
import PercentAllocationMonthly from "../../components/Charts/percentAllocationMonthly";
import PercentMostUsedSalasByCapacity from "../../components/Charts/percentMostUsedSalasByCapacity";
import RealDataFromSala from "../../components/Charts/realDataFromSala";
import SalaLimpeza from "../../components/Charts/salasLimpeza";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);
  const [error, setError] = useState("");

  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfCenters, setNumberOfCenters] = useState(0);
  const [salaMostPopular, setSalaMostPopular] = useState("Indeterminada");

  const [inicioQtyReserva, setInicioQtyReserva] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [fimQtyReserva, setFimQtyReserva] = useState(
    dayPlusSeven(new Date()).toISOString().slice(0, 10)
  );

  const [capacityPercentMostUsedSalas, setCapacityPercentMostUsedSalas] =
    useState("");
  const [listaCapacidades, setListaCapacidades] = useState([]);

  const [listaSalas, setListaSalas] = useState([]);
  const [salaReserva, setSalaReserva] = useState("");

  const [listaCentros, setListaCentros] = useState([]);
  const [centroReserva, setCentroReserva] = useState("");

  const [centroLimpeza, setCentroLimpeza] = useState("");

  useEffect(() => {
    document.title = "Softinsa Reunions";
    if (storageUser)
      AuthService.getCurrentUser(storageUser.token).then((response) =>
        setUser(response)
      );

    if (!storageUser) {
      navigate("/login");
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
      .catch((error) => {
        setError(error);
      });

    function getnumberOfUsers() {
      const numberOfUsersUrl =
        "https://backend-pint2022.herokuapp.com/user/getNumberOfUsers";
      axios
        .get(numberOfUsersUrl, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            setNumberOfUsers(response.data.data);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }

    function getnumberOfCenters() {
      const numberOfCentersUrl =
        "https://backend-pint2022.herokuapp.com/centros/getNumberOfCenters";
      axios
        .get(numberOfCentersUrl, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            setNumberOfCenters(response.data.data);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }

    function getSalaMostPopular() {
      const getSalaMostPopular =
        "https://backend-pint2022.herokuapp.com/reservas/getSalaMostPopular";
      axios
        .get(getSalaMostPopular, { headers: authHeader() })
        .then((response) => {
          if (response.data.success) {
            setSalaMostPopular(response.data.data[0].Sala.nomesala);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }

    function getListOfUniqueAlocacao_maxima() {
      axios
        .get(
          "https://backend-pint2022.herokuapp.com/salas/listUniqueAlocacao_maxima",
          { headers: authHeader() }
        )
        .then((res) => {
          if (res.data.success) {
            setListaCapacidades(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }

    function getSalasList() {
      axios
        .get("https://backend-pint2022.herokuapp.com/salas/list", {
          headers: authHeader(),
        })
        .then((res) => {
          if (res.data.success) {
            setListaSalas(res.data.data);
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
            setListaCentros(res.data.data);
          } else {
            setError(res.data.data);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    }
    getnumberOfUsers();
    getnumberOfCenters();
    getSalaMostPopular();
    getListOfUniqueAlocacao_maxima();
    getCentrosData();
    getSalasList();
  }, []);

  function qtyReservaResetDate() {
    setInicioQtyReserva(new Date().toISOString().slice(0, 10));
    setFimQtyReserva(dayPlusSeven(new Date()).toISOString().slice(0, 10));
  }

  /// usa date format
  function dayPlusSeven(dia) {
    dia.setDate(dia.getDate() + 7);
    return dia;
  }

  return (
    <div className="home">
      <div className="homeContainer">
        <Navbar title="Dashboard" user={user} />
        <div className="pageContent">
          <div className="featured">
            <div className="featuredItem">
              <div className="d-flex">
                <span
                  className="featuredTitle"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Numero de Reservas:
                </span>
                <div
                  className="d-flex gap-2 ml-auto"
                  style={{ width: "fit-content", marginLeft: "auto" }}
                >
                  <Form.Group
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: "200px",
                    }}
                  >
                    <label className="mx-2">Início:</label>
                    <input
                      className="form-control"
                      type="date"
                      id="qtyReservaStart"
                      max={fimQtyReserva}
                      onChange={(value) =>
                        setInicioQtyReserva(value.target.value)
                      }
                      value={inicioQtyReserva}
                    />
                  </Form.Group>
                  <Form.Group
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: "200px",
                    }}
                  >
                    <label className="mx-2">Fim:</label>
                    <input
                      className="form-control"
                      type="date"
                      id="qtyReservaEnd"
                      min={inicioQtyReserva}
                      onChange={(value) => setFimQtyReserva(value.target.value)}
                      value={fimQtyReserva}
                    />
                  </Form.Group>
                  <button
                    className="btn btn-danger h-100"
                    style={{ width: "fit-content" }}
                    onClick={() => qtyReservaResetDate()}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="featuredInfoContainer">
                <NumeroReservas
                  dataIncial={inicioQtyReserva}
                  dataFinal={fimQtyReserva}
                />
              </div>
            </div>
            <div className="featuredItem">
              <span className="featuredTitle">Alocação Diária</span>
              <div className="featuredInfoContainer">
                <PercentAllocationMonthly />
              </div>
            </div>
          </div>
          <span></span>
          <div className="featured">
            <div className="featuredItem">
              <span
                className="featuredTitle"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Reservas:
                <div>
                  <Form.Group
                    className="mb-2"
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Form.Select
                      style={{ marginLeft: "8px", marginRight: "12px" }}
                      required
                      defaultValue={0}
                      onChange={(value) => {
                        setCentroReserva(value.target.value);
                        setSalaReserva(0);
                        document.getElementById("escolhaSala").value = 0;
                      }}
                    >
                      <option hidden value={0}>
                        Centro
                      </option>
                      {listaCentros?.map((centro, index) => (
                        <option key={index} value={centro.id_centro}>
                          {centro.nomecentro}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      style={{ marginLeft: "8px", marginRight: "12px" }}
                      id="escolhaSala"
                      disabled={centroReserva ? false : true}
                      required
                      defaultValue={0}
                      onChange={(value) => setSalaReserva(value.target.value)}
                    >
                      <option hidden value={0}>
                        Sala
                      </option>
                      {listaSalas
                        ?.filter((sala) => sala.id_centro == centroReserva)
                        .map((sala, index) => (
                          <option key={index} value={sala.id_sala}>
                            {sala.nomesala}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </span>
              <div className="featuredInfoContainer">
                <RealDataFromSala
                  salaSelecionada={salaReserva}
                  centroSelecionado={centroReserva}
                />
              </div>
            </div>
            <div className="featuredItem">
              <span
                className="featuredTitle"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Salas em limpeza
                <div>
                  <Form.Group
                    className="mb-2"
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Form.Select
                      style={{ marginLeft: "8px", marginRight: "12px" }}
                      required
                      defaultValue={0}
                      onChange={(value) => setCentroLimpeza(value.target.value)}
                    >
                      <option hidden value={0}>
                        Centro
                      </option>
                      {listaCentros?.map((centro, index) => (
                        <option key={index} value={centro.id_centro}>
                          {centro.nomecentro}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </span>
              <div className="featuredInfoContainer">
                <SalaLimpeza centroSelecionada={centroLimpeza} />
              </div>
            </div>
          </div>
          <span></span>
          <div className="featured">
            <div className="featuredItem">
              <span
                className="featuredTitle"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Salas mais utilizadas
                <div style={{ marginRight: "12px" }}>
                  <Form.Group className="mb-2">
                    <Form.Select
                      required
                      defaultValue={0}
                      onChange={(value) =>
                        setCapacityPercentMostUsedSalas(value.target.value)
                      }
                    >
                      <option hidden value={0}>
                        Capacidade
                      </option>
                      {listaCapacidades?.map((capacidade, index) => (
                        <option key={index} value={capacidade.alocacao_maxima}>
                          {capacidade.alocacao_maxima}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </span>
              <div className="featuredInfoContainer">
                <PercentMostUsedSalasByCapacity
                  capacidade={capacityPercentMostUsedSalas}
                />
              </div>
              <div className="featuredInfoContainer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
