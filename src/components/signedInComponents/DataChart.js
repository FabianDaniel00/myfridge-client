import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "../../style/DataChart.scss";

export default function DataChart({ pageTransitions }) {
  const [chartData, setChartData] = useState("");
  const [loadingChartData, setLoadingChartData] = useState(true);
  const [errorChartData, setErrorChartData] = useState("");

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = () => {
    axios
      .get("http://localhost:8080/recipes/r/r/r/get_data_for_chart", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setErrorChartData(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          const randomColors = [];
          const dataLength = response.data.data.length;
          for (let i = 0; i < dataLength; i++) {
            const color =
              "rgba(" +
              Math.floor(Math.random() * 256) +
              ", " +
              Math.floor(Math.random() * 256) +
              ", " +
              Math.floor(Math.random() * 256) +
              ", 0.5)";
            randomColors.push(color);
          }
          const chartData_ = {
            labels: [],
            datasets: [
              {
                data: [],
                backgroundColor: randomColors,
                borderColor: randomColors,
                borderWidth: 3,
              },
            ],
          };
          for (const data of response.data.data) {
            chartData_.labels.push(data.g_name);
            chartData_.datasets[0].data.push(data.grocery_count);
          }
          setChartData(chartData_);
        }
        setLoadingChartData(false);
      })
      .catch((error) => {
        setErrorChartData(error.message);
        setLoadingChartData(false);
      });
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1 style={{ textAlign: "center" }}>Groceries Chart</h1>
      <div className="chart">
        {loadingChartData ? (
          <i
            style={{ margin: "0 auto", fontSize: "25px" }}
            className="fa fa-spinner fa-spin"
          />
        ) : errorChartData ? (
          <span style={{ textAlign: "center", fontSize: "25px" }}>
            {errorChartData}
          </span>
        ) : chartData.datasets[0].data.length ? (
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: "Used groceries frequency from the last month",
                fontSize: 25,
              },
              legend: {
                display: false,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                    },
                  },
                ],
                pointLabels: { fontSize: 20 },
              },
              responsive: true,
            }}
          />
        ) : (
          <span style={{ textAlign: "center", margin: "0 auto" }}>
            There is no data to show because you don't updated your fridge yet!
          </span>
        )}
      </div>
    </motion.div>
  );
}
