import React, { useContext, useRef } from "react";
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { DataContext } from "../contexts/DataContext";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  StreamingPlugin
);

export default function Stream() {
  const { boatData } = useContext(DataContext);
  const datasetsRef = useRef([[], []]);

  const getNewDataPoint = () => {
    const course = boatData?.data?.gps?.course;
    return course ? { x: Date.now(), y: course } : null;
  };

  return (
    <Line
      data={{
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            borderDash: [8, 4],
            fill: true,
            data: datasetsRef.current[0],
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            cubicInterpolationMode: "monotone",
            fill: true,
            data: datasetsRef.current[1],
          }
        ]
      }}
      options={{
        scales: {
          x: {
            type: "realtime",
            realtime: {
              delay: 500,
              duration: 20000,
              refresh: 200,
              onRefresh: (chart) => {
                const newDataPoint = getNewDataPoint();
                if (!newDataPoint) return;

                chart.data.datasets.forEach((dataset, index) => {
                  datasetsRef.current[index].push(newDataPoint);
                });
                
                chart.update('none');
              }
            }
          },
          y: {
            min: 0,
            max: 360
          }
        }
      }}
    />
  );
}
