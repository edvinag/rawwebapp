import React, { useEffect, useRef, useContext } from "react";
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { DataContext } from "../contexts/DataContext"; // Import DataContext

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
  const { boatData } = useContext(DataContext); // Use DataContext to get boatData
  const dataset1Data = useRef([]);
  const dataset2Data = useRef([]);

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
            data: dataset1Data.current
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            cubicInterpolationMode: "monotone",
            fill: true,
            data: dataset2Data.current
          }
        ]
      }}
      options={{
        scales: {
          x: {
            type: "realtime",
            realtime: {
              delay: 500,
              duration: 20000, // Keep 20 seconds of data
              refresh: 200, // Refresh every second
              onRefresh: (chart) => {
                console.log("onRefresh called");
                chart.data.datasets.forEach((dataset, index) => {
                  const latestPath = boatData?.path?.[boatData.path.length - 1];
                  console.log("course", boatData?.data?.gps?.course);
                  if (!boatData?.data?.gps?.course) return;
                  const newDataPoint = {
                    x: Date.now(),
                    y: boatData?.data?.gps?.course
                  };
                  dataset.data.push(newDataPoint);
                });
                chart.update('none'); // Force a full update without animations
              }
            }
          },
          y: {
            min: 0, // Set the minimum value for the y-axis
            max: 360  // Set the maximum value for the y-axis
          }
        }
      }}
    />
  );
}