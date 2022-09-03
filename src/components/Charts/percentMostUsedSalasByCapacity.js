import { Chart as ChartJS, TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

ChartJS.register(TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const possibleBG = [
  "rgb(30, 65, 115)",
  "rgb(36, 80, 138)",
  "rgb(40, 89, 154)",
  "rgb(48, 108, 186)",
  "rgb(69, 128, 207)",
  "rgb(85, 139, 211)",
  "rgb(101, 150, 215)",
  "rgb(117, 161, 219)",
  "rgb(133, 172, 224)",
  "rgb(77, 114, 199)",
  "rgb(51, 85, 163)",
  "rgb(61, 144, 194)",
  "rgba(51, 126, 156, 0.9)",
];
var bgColors = [];

const PercentMostUsedSalasByCapacity = (entrada) => {
  const [data, setData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: "rgba(100,200,255,1)",
      },
    ],
  });

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function colorFULL(data) {
    for (var i = bgColors.length; i < data.length; i++) {
      bgColors[i] = possibleBG[random(0, possibleBG.length - 1)];
    }
  }

  useEffect(() => {
    if (entrada.capacidade.length != 0) {
      axios
        .get("https://softinsa-reunions-back.herokuapp.com/reservas/percentMostUsedSalasByCapacity/" + entrada.capacidade, {
          headers: authHeader(),
        })
        .then((res) => {
          {
            colorFULL(res.data.data);
            setData({
              datasets: [
                {
                  data: res.data.data,
                  backgroundColor: bgColors,
                },
              ],
            });
          }
        })
        .catch((error) => {});
    }
  }, [entrada.capacidade]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItems) {
            return " " + tooltipItems.formattedValue + "%";
          },
        },
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: "true",
        suggestedMax: 10,
        ticks: {
          callback: function (value) {
            return (value / 1).toString() + "%";
          },
        },
      },
    },
  };

  return (
    <>
      <Bar options={options} data={data} height={20} width={100} />
    </>
  );
};
export default PercentMostUsedSalasByCapacity;
