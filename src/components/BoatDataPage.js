import React, { useEffect, useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BoatDataPage = () => {
  const { boatData, loading, error } = useDataContext();
  const [historicalData, setHistoricalData] = useState({
    gpsCourse: [],
    controllerRefCourse: [],
    courseDiff: [],
    labels: []
  });

  useEffect(() => {
    const storedData = localStorage.getItem('historicalData');
    if (storedData) {
      setHistoricalData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (boatData && boatData.data) {
      const { gps, controller } = boatData.data;
      const courseDiff = calculateCourseDiff(gps.course, boatData.settings.controller.refCourse);

      const newHistoricalData = {
        gpsCourse: [...historicalData.gpsCourse, gps.course],
        controllerRefCourse: [...historicalData.controllerRefCourse, boatData.settings.controller.refCourse],
        courseDiff: [...historicalData.courseDiff, courseDiff],
        labels: [...historicalData.labels, new Date().toLocaleTimeString()]
      };

      setHistoricalData(newHistoricalData);
      localStorage.setItem('historicalData', JSON.stringify(newHistoricalData));
    }
  }, [boatData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!boatData || !boatData.data) {
    return <div>No data available</div>;
  }

  const { gps, rudder, controller } = boatData.data;

  const calculateCourseDiff = (course, refCourse) => {
    let diff = course - refCourse;
    diff = (diff + 360) % 360;
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  };

  const data = {
    labels: historicalData.labels,
    datasets: [
      {
        label: 'GPS Course',
        data: historicalData.gpsCourse,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Controller Ref Course',
        data: historicalData.controllerRefCourse,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
      {
        label: 'Course Diff',
        data: historicalData.courseDiff,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Boat Data Degrees',
      },
    },
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h1>Boat Data</h1>
      <h2>GPS</h2>
      <p>Latitude: {gps.location.latitude}</p>
      <p>Longitude: {gps.location.longitude}</p>
      <p>Course: {gps.course}</p>

      <h2>Rudder</h2>
      <p>Position: {rudder.position}</p>
      <p>Voltage: {rudder.voltage}</p>
      <p>Filtered Voltage: {rudder.filteredVoltage}</p>

      <h2>Controller</h2>
      <p>Output Min: {controller.output.min}</p>
      <p>Output Max: {controller.output.max}</p>
      <p>Output Zero: {controller.output.zero}</p>
      <p>Output: {controller.error}</p>
      <p>Course Diff: {calculateCourseDiff(gps.course, boatData.settings.controller.refCourse)}</p>

      <h2>Graph</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default BoatDataPage;