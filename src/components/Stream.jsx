import React, { useRef } from "react";
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend } from "chart.js";
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

export default function Stream({ dataSources }) {
  const datasetsRef = useRef(dataSources.map(() => []));

  return (
    <Line
      data={{
        datasets: dataSources.map((source, index) => ({
          label: source.label,
          backgroundColor: source.backgroundColor || "rgba(0, 0, 0, 0.1)",
          borderColor: source.borderColor || "rgb(0, 0, 0)",
          borderDash: source.borderDash || [],
          cubicInterpolationMode: source.cubicInterpolationMode || "default",
          fill: source.fill !== undefined ? source.fill : true,
          data: datasetsRef.current[index],
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
                  const newData = source.getDataPoint();
                  if (newData) datasetsRef.current[index].push(newData);
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
