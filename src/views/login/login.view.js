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
        Este campo é obrigatório!
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
    document.title = "Login";
  });

  return (
    <div className="container mt-5 justify-content-center">
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 border border-primary">
          <div className="card_login px-5 py-5" id="form1">
            <div className="textHeader mb-4">Softinsa</div>
            <Form id="loginform" onSubmit={handleLogin} ref={form}>
              <div className="form-data">
                <div className="forms-inputs mb-4">
                  <span>Email</span>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    validations={[required]}
                  />
                </div>
                <div className="forms-inputs mb-4">
                  <span>Password</span>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    validations={[required]}
                  />
                </div>
                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
                <div className="form-group w-50 mx-auto">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>
                
              </div>
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
