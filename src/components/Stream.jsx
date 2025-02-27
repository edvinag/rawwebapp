import React, { useRef } from "react";
import {
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";

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

// Default colors for datasets
const defaultColors = [
  { background: "rgba(255, 99, 132, 0.5)", border: "rgb(255, 99, 132)" },
  { background: "rgba(54, 162, 235, 0.5)", border: "rgb(54, 162, 235)" },
  { background: "rgba(75, 192, 192, 0.5)", border: "rgb(75, 192, 192)" },
  { background: "rgba(255, 206, 86, 0.5)", border: "rgb(255, 206, 86)" },
  { background: "rgba(153, 102, 255, 0.5)", border: "rgb(153, 102, 255)" }
];

export default function Stream({ dataSources, yMin = null, yMax = null }) {
  const datasetsRef = useRef(dataSources.map(() => []));

  return (
    <Line
      data={{
        datasets: dataSources.map((source, index) => ({
          label: source.label || `Dataset ${index + 1}`,
          backgroundColor: defaultColors[index % defaultColors.length].background,
          borderColor: defaultColors[index % defaultColors.length].border,
          borderDash: [],
          cubicInterpolationMode: "default",
          fill: true,
          data: datasetsRef.current[index]
        }))
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
                dataSources.forEach((source, index) => {
                  if (source.data !== undefined && source.data !== null) {
                    datasetsRef.current[index].push({ x: Date.now(), y: source.data });
                  }
                });
                chart.update("none");
              }
            }
          },
          y: {
            min: yMin !== null ? yMin : undefined, // Use provided min, otherwise dynamic
            max: yMax !== null ? yMax : undefined, // Use provided max, otherwise dynamic
          }
        }
      }}
    />
  );
}
