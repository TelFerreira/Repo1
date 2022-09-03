import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../actions/auth";
import "bootstrap/dist/css/bootstrap.css";
import "./login-view.css";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger alerts-wrapper" role="alert">
        Este campo é de preenchimento obrigatório!
      </div>
    );
  }
};

const Login = () => {
  const form = useRef();
  const checkBtn = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    AuthService.logout();
    setLoading(true); // Set spinner true
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(user.email, user.password))
        .then((result) => {
          if (result.success) {
            setMessage(result.message);
            navigate("/dashboard");
          } else if (result.success === false) {
            setLoading(false);
            setMessage(result.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage("Login inválido. Tente novamente");
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Softinsa Reunions";
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar header-background">
        <a className="navbar-brand" href="#"></a>
        <a className="a-color col-lg-10 text-center text-md-start">Softinsa Reunions</a>
      </nav>
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-6">
            <div className="card_login px-5 py-5" id="form1">
              <Form id="loginform" onSubmit={handleLogin} ref={form}>
                <div className="form-data">
                  <div className="forms-inputs mb-4">
                    <span>Email do utilizador</span>
                    <Input type="text" className="form-control" name="username" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} validations={[required]} />
                  </div>
                  <div className="forms-inputs mb-4">
                    <span>Password</span>
                    <Input type="password" className="form-control" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} validations={[required]} />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-color" disabled={loading}>
                      {loading && <span className="spinner-border spinner-border-sm"></span>}
                      <span>Iniciar Sessão</span>
                    </button>
                  </div>
                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                </div>
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
              </Form>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer-wrapper mt-auto">
        <div className="container p-4 pb-0">
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3"></div>
              </div>
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                © 2022 Copyright <a className="text-white"> Reunionss </a>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default Login;
