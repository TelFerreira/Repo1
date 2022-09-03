import axios from "axios";
import authHeader from "./auth-header";

const register = (primeironome, sobrenome, email, password, passwordprecisaupdate, emailconfirmado, activeStatus, id_centro, id_tipoUtilizador, id_permissao) => {
  return axios.post(
    "https://softinsa-reunions-back.herokuapp.com/user/register",
    {
      primeironome,
      sobrenome,
      email,
      password,
      passwordprecisaupdate,
      emailconfirmado,
      activeStatus,
      id_centro,
      id_tipoUtilizador,
      id_permissao,
    },
    { headers: authHeader() }
  );
};

const getCurrentUser = (userToken) => {
  return axios.get("https://softinsa-reunions-back.herokuapp.com/user/getByToken/" + userToken, { headers: authHeader() }).then((response) => {
    if (response.data) {
      return response.data;
    }
  });
};

const login = (email, password) => {
  return axios.post("https://softinsa-reunions-back.herokuapp.com/user/login", { email, password }).then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  getCurrentUser,
  login,
  logout,
};
