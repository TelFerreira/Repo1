import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./views/login/login.view";
import Dashboard from "./views/dashboard/dashboard-view";
import Utilizadores from "./views/utilizadores/utilizadores-view";
import EditarUtilizador from "./views/utilizadores/editarUtilizador/editarUtilizador-view";
import AlterarPassword from "./views/alterarPassword/alterarPassword-view";
import Centros from "./views/centros/centros-view";
import EditarCentro from "./views/centros/editarCentro/editarcentro-view";
import Salas from "./views/salas/salas-view";
import EditarSala from "./views/salas/editarSala/editarSala-view";
import Localizacoes from "./views/localizacoes/localizacoes-view";
import EditarLocal from "./views/localizacoes/editarLocalizacoes/editarLocalizacoes-view";
import Reservas from "./views/reservas/reservas-view";
import { history } from "./helpers/history";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage());
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Routes history={history}>
        <Route path="/login" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/utilizadores" element={<Utilizadores />} />
        <Route exact path="/editarUtilizador/:id" element={<EditarUtilizador />} />
        <Route exact path="/alterarPassword/:id" element={<AlterarPassword />} />
        <Route exact path="/centros" element={<Centros />} />
        <Route exact path="/editarCentro/:id" element={<EditarCentro />} />
        <Route exact path="/salas" element={<Salas />} />
        <Route exact path="/editarSala/:id" element={<EditarSala />} />
        <Route exact path="/localizacoes" element={<Localizacoes />} />
        <Route exact path="/editarLocal/:id" element={<EditarLocal />} />
        <Route exact path="/reservas" element={<Reservas />} />
        <Route exact path="/*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
