import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import authHeader from "../../services/auth-header";

function formatFimByLimpeza(fim, tempoLimpeza) {
  var h = parseInt(fim.slice(0, 2));
  var m = parseInt(fim.slice(3, 5));

  m -= parseInt(tempoLimpeza);
  while (m < 0) {
    m += 60;
    h -= 1;
  }
  if (h < 0) {
    h = 22 - h;
  }

  // juntar as string
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  return h + ":" + m;
}

const RealDataFromSala = (entrada) => {
  const [tableInfo, setTableInfo] = useState([]);

  useEffect(() => {
    if (entrada.salaSelecionada.length != 0 && entrada.salaSelecionada != 0) {
      axios
        .get(
          "https://backend-pint2022.herokuapp.com/reservas/getListBySalaTodayTomorrow/" +
            entrada.salaSelecionada,
          {
            headers: authHeader(),
          }
        )
        .then((res) => {
          console.log(res.data.data);
          setTableInfo(res.data.data);
        })
        .catch((error) => {});
    } else {
      if (entrada.centroSelecionado.length != 0) {
        axios
          .get(
            "https://backend-pint2022.herokuapp.com/reservas/getListByCentroTodayTomorrow/" +
              entrada.centroSelecionado,
            {
              headers: authHeader(),
            }
          )
          .then((res) => {
            console.log(res.data.data);
            setTableInfo(res.data.data);
          })
          .catch((error) => {});
      }
    }
  }, [entrada.salaSelecionada, entrada.centroSelecionado]);

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>De</th>
            <th>Data</th>
            <th>Inicio - Fim</th>
            <th>Sala</th>
            <th>Participantes</th>
          </tr>
        </thead>
        <tbody>
          {tableInfo
            ?.filter((info) => {
              return info.cancelado ? false : true;
            })
            .map((info, index) => (
              <tr>
                <td>
                  {info.Utilizadore.primeironome +
                    " " +
                    info.Utilizadore.sobrenome}{" "}
                </td>
                <td>{info.dataReserva}</td>
                <td>
                  {info.horaInicio.slice(0, 5) +
                    " - " +
                    formatFimByLimpeza(info.horaFim, info.Sala.tempo_limpeza)}
                </td>
                <td>{info.Sala.nomesala}</td>
                <td>{info.nr_participantes}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};
export default RealDataFromSala;
