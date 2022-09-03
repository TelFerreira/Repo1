import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Button from "@mui/material/Button";
import authHeader from "../../services/auth-header";

const SalaLimpeza = (entrada) => {
  const [tableInfo, setTableInfo] = useState([]);

  useEffect(() => {
    if (entrada.dataIncial.length != 0 && entrada.dataFinal.length != 0) {
      if (entrada.idCentro.length != 0 && entrada.idCentro != 0) {
        axios
          .get("https://softinsa-reunions-back.herokuapp.com/reservas/getListByDateIntervalByCenter", {
            headers: authHeader(),
            params: {
              dataIncial: entrada.dataIncial,
              dataFinal: entrada.dataFinal,
              idCentro: entrada.idCentro,
            },
          })
          .then((res) => {
            setTableInfo(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .get("https://softinsa-reunions-back.herokuapp.com/reservas/getListByDateInterval", {
            headers: authHeader(),
            params: {
              dataIncial: entrada.dataIncial,
              dataFinal: entrada.dataFinal,
            },
          })
          .then((res) => {
            setTableInfo(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [entrada.dataIncial, entrada.dataFinal, entrada.idCentro]);

  function eliminar(id) {
    axios
      .delete("https://softinsa-reunions-back.herokuapp.com/reservas/delete/" + id)
      .then((response) => {
        if (response.data.success) {
          alert("Reserva Eliminada");
          window.location.reload();
        } else {
          alert(response.data.data);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Reservador</th>
            <th>Data</th>
            <th>Periodo de Reunião</th>
            <th>Nome da Sala</th>
            <th>Descrição</th>
            <th>Cancelada</th>
            <th>Nrº Participantes</th>
          </tr>
        </thead>
        <tbody>
          {tableInfo.map((info, index) => (
            <tr>
              <td>{info.id_reserva}</td>
              <td>{info.Utilizadore.primeironome + " " + info.Utilizadore.sobrenome} </td>
              <td>{info.dataReserva}</td>
              <td>{info.horaInicio.slice(0, 5) + " - " + info.horaFim.slice(0, 5)}</td>
              <td>{info.Sala.nomesala}</td>
              <td>{info.descricao}</td>
              <td>{info.cancelado ? "Cancelada" : "Ativa"}</td>
              <td>{info.nr_participantes}</td>
              <td>
                <Button variant="outlined" color="error" onClick={() => eliminar(info.id_reserva)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
export default SalaLimpeza;
