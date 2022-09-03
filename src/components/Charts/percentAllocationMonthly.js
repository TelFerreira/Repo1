import { Chart as ChartJS, TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

ChartJS.register(TimeScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

//data inicial
//data final

const PercentAllocationMonthly = () => {
  //new Date().setMonth(0).toISOString().slice(0, 7),
  const [valores, setValores] = useState();

  useEffect(() => {
    axios
      .get("https://softinsa-reunions-back.herokuapp.com/reservas/percentAllocationMonthly", { headers: authHeader() })
      .then((res) => {
        setValores(res.data.data);
      })
      .catch((error) => {});
  }, []);

  function printObject(o) {
    var out = "";
    for (var p in o) {
      out += p + ": " + o[p] + "\n";
    }
    alert(out);
  }
  //prob change tooltip ChartJs
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            //printObject(tooltipItems[0].parsed);
            return tooltipItems[0].label.slice(0, 12);
          },
          label: function (tooltipItems) {
            return " " + tooltipItems.formattedValue + "%";
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "MMM dd",
          },
        },
      },
      y: {
        beginAtZero: "true",
        suggestedMax: 10,
        title: {
          display: false,
          text: "Percentagem",
        },
        ticks: {
          callback: function (value) {
            return (value / 1).toString() + "%";
          },
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        data: valores,
        backgroundColor: "rgba(100,200,255,1)",
      },
    ],
  };

  return (
    <>
      <Bar options={options} data={data} height={20} width={50} />
    </>
  );
};
export default PercentAllocationMonthly;
