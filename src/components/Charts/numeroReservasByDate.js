import { Chart as ChartJS, TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

ChartJS.register(TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const NumeroReservasByDate = (datas) => {
  const [data, setData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: "rgba(100,200,255,1)",
      },
    ],
  });

  useEffect(() => {
    axios
      .get("https://backend-pint2022.herokuapp.com/reservas/qtyReservasByDate", {
        headers: authHeader(),
        params: {
          dataIncial: datas.dataIncial,
          dataFinal: datas.dataFinal,
        },
      })
      .then((res) => {
        setData({
          datasets: [
            {
              data: res.data.data,
              backgroundColor: "rgba(100,200,255,1)",
            },
          ],
        });
      })
      .catch((error) => {});
  }, [datas.dataIncial, datas.dataFinal]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (tooltipItems, data) {
            return tooltipItems[0].label.slice(0, 12);
          },
        },
      },
    },
    scales: {
      x: { type: "time", time: { unit: "day" } },
      y: { beginAtZero: "true", suggestedMax: 10 },
    },
  };

  return (
    <>
      <Bar options={options} data={data} height={20} width={50} />
    </>
  );
};
export default NumeroReservasByDate;
