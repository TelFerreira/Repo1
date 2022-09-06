import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import authHeader from "../../services/auth-header";

const SalaLimpeza = (entrada) => {
  const [tableInfo, setTableInfo] = useState([]);

  function addTimeOnString(hora, minutos, incremento) {
    var h = parseInt(hora);
    var m = parseInt(minutos);
    //adicionar o incremento
    m += parseInt(incremento);
    while (m >= 60) {
      h += 1;
      m -= 60;
    }
    // juntar as string
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    const horaFormatada = h + ":" + m;
    return horaFormatada;
  }

  useEffect(() => {
    if (entrada.centroSelecionada.length != 0) {
      axios
        .get(
          "https://backend-pint2022.herokuapp.com/reservas/getListByLimpeza/" +
            entrada.centroSelecionada,
          {
            headers: authHeader(),
          }
        )
        .then((res) => {
          setTableInfo(res.data.data);
        })
        .catch((error) => {});
    }
  }, [entrada.centroSelecionada]);

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Nome da Sala</th>
            <th>Fim da Limpeza</th>
            <th>Participantes</th>
          </tr>
        </thead>
        <tbody>
          {tableInfo
            ?.filter((info) => {
              const tempo = new Date().toLocaleTimeString();
              return (
                info.horaFim <
                  addTimeOnString(
                    tempo.slice(0, 2),
                    tempo.slice(3, 5),
                    info.tempo_limpeza
                  ) && info.horaFim > tempo.slice(0, 5)
              );
            })
            .map((info, index) => (
              <tr>
                <td>{info.nomesala}</td>
                <td>{info.horaFim.slice(0, 5)}</td>
                <td>{info.nr_participantes}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};
export default SalaLimpeza;
