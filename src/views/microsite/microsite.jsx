import React from "react";
import landing from "../../assets/img/landing.jpg";
import CustomNavbar from "../../components/Navbar";
import softinsaLogo from "../../assets/img/softinsa-logo.png";
function Microsite() {
  return (
    <>
      <CustomNavbar />
      <div className="d-flex justify-content-center gap-5">
        <div style={{ maxWidth: "600px" }}>
          <img
            src={softinsaLogo}
            style={{ borderRadius: "20px", height: "90px" }}
            alt="..."
          />
          <h2>Gere os teus espaços</h2>
          <h5>
            Solução integrada que permite a gestão e reserva de salas em espaços
            privados face à sua capacidade e em virtude da alocação máxima
            permitida por efeitos da pandemia Covid-19
          </h5>
          <div className="d-flex gap-2">
            <a
              href="https://backend-pint2022.herokuapp.com/mobile"
              className="btn btn-primary h-100"
            >
              Telemóvel
            </a>
            <a
              href="https://backend-pint2022.herokuapp.com/tablet"
              className="btn btn-primary h-100"
            >
              Tablet
            </a>
          </div>
        </div>
        <img
          src={landing}
          style={{ borderRadius: "20px", width: "500px", height: "350px" }}
          alt="..."
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: "100px",
          width: "100%",
        }}
      >
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <p className="p-0 m-0">&copy; {new Date().getFullYear()} Copyright</p>
          <a className="text-dark" href="https://softinsa.pt/">
            Softinsa
          </a>
          <p className="p-0 m-0">Projeto Integrado</p>
        </div>
      </div>
    </>
  );
}

export default Microsite;
