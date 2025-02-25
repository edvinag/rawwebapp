import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import StreamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';
import { useDataContext } from '../contexts/DataContext';

Chart.register(...registerables, StreamingPlugin);

const BoatDataChart = () => {
  const { boatData } = useDataContext();
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    const updateChart = () => {
      console.log('Updating chart with data:', boatData.data.gps.location.longitude);
      chart.data.datasets[0].data.push({
        x: Date.now(),
        y: 1, // Assuming longitude for y-axis
      });
      chart.update({ preservation: true });
    };

    const interval = setInterval(updateChart, 500);
    return () => clearInterval(interval);
  }, [boatData]);

  const data = {
    datasets: [
      {
        label: 'Boat Longitude',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        data: [],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          duration: 20000,
          refresh: 500,
          delay: 1000,
          onRefresh: (chart) => {
            chart.data.datasets.forEach((dataset) => {
              dataset.data.push({
                x: Date.now(),
                y: 1, // Assuming longitude for y-axis
              });
            });
          },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return <Line ref={chartRef} data={data} options={options} />;
};

export default BoatDataChart;