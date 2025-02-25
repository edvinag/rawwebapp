import React, { useEffect, useRef } from "react";
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";

// Polyfill for requestAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 1000 / 60);
  };
}

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
  const dataset1Data = useRef([]);
  const dataset2Data = useRef([]);

  useEffect(() => {
    return () => {
      Object.keys(Chart.instances).forEach((key) => {
        const chart = Chart.instances[key];
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

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
                  const newDataPoint = {
                    x: Date.now(),
                    y: Math.random()
                  };
                  console.log("Adding data point:", newDataPoint);
                  if (index === 0) {
                    dataset1Data.current.push(newDataPoint);
                  } else {
                    dataset2Data.current.push(newDataPoint);
                  }
                  console.log("Dataset length:", dataset.data.length);
                });
                chart.update('none'); // Force a full update without animations
              }
            }
          },
          y: {
            min: 0, // Set the minimum value for the y-axis
            max: 1  // Set the maximum value for the y-axis
          }
        }
      }}
    />
  );
}