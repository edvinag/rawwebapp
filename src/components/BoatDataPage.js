import React, { useEffect, useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BoatDataPage = () => {
  const { boatData, loading, error } = useDataContext();
  const [historicalData, setHistoricalData] = useState({
    gpsCourse: [],
    controllerRefCourse: [],
    courseDiff: [],
    rudderVoltage: [],
    rudderFilteredVoltage: [],
    rudderPosition: [],
    rudderRef: [],
    labels: [],
    timestamps: []
  });

  const [showGraphs, setShowGraphs] = useState({
    boatData: true,
    rudderVoltage: true,
    rudderPosition: true
  });

  const handleCheckboxChange = (event) => {
    setShowGraphs({
      ...showGraphs,
      [event.target.name]: event.target.checked
    });
  };

  const calculateCourseDiff = (course, refCourse) => {
    let diff = course - refCourse;
    diff = (diff + 360) % 360;
    return diff > 180 ? 360 - diff : diff;
  };

  useEffect(() => {
    const storedData = localStorage.getItem('historicalData');
    if (storedData) {
      setHistoricalData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (boatData?.data) {
      const { gps, rudder, controller } = boatData.data;
      const courseDiff = calculateCourseDiff(gps.course, boatData.settings.controller.refCourse);
      const now = new Date().getTime();
      
      const newHistoricalData = {
        gpsCourse: [...historicalData.gpsCourse, gps.course],
        controllerRefCourse: [...historicalData.controllerRefCourse, boatData.settings.controller.refCourse],
        courseDiff: [...historicalData.courseDiff, courseDiff],
        rudderVoltage: [...historicalData.rudderVoltage, rudder.voltage],
        rudderFilteredVoltage: [...historicalData.rudderFilteredVoltage, rudder.filteredVoltage],
        rudderPosition: [...historicalData.rudderPosition, rudder.position],
        rudderRef: [...historicalData.rudderRef, boatData.settings.rudder.ref],
        labels: [...historicalData.labels, new Date().toLocaleTimeString()],
        timestamps: [...historicalData.timestamps, now]
      };

      const timeFilter = now - 30 * 1000;
      setHistoricalData({
        gpsCourse: newHistoricalData.gpsCourse.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        controllerRefCourse: newHistoricalData.controllerRefCourse.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        courseDiff: newHistoricalData.courseDiff.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        rudderVoltage: newHistoricalData.rudderVoltage.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        rudderFilteredVoltage: newHistoricalData.rudderFilteredVoltage.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        rudderPosition: newHistoricalData.rudderPosition.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        rudderRef: newHistoricalData.rudderRef.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        labels: newHistoricalData.labels.filter((_, i) => newHistoricalData.timestamps[i] >= timeFilter),
        timestamps: newHistoricalData.timestamps.filter((t) => t >= timeFilter)
      });
    }
  }, [boatData]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!boatData?.data) return <Typography>No data available</Typography>;

  const { gps, rudder, controller } = boatData.data;

  const data = {
    labels: historicalData.labels,
    datasets: [
      { label: 'GPS Course', data: historicalData.gpsCourse, borderColor: '#4bc0c0' },
      { label: 'Controller Ref Course', data: historicalData.controllerRefCourse, borderColor: '#9966ff' },
      { label: 'Course Diff', data: historicalData.courseDiff, borderColor: '#ff9f40' },
    ],
  };

  const rudderData = {
    labels: historicalData.labels,
    datasets: [
      { label: 'Rudder Voltage', data: historicalData.rudderVoltage, borderColor: '#36a2eb' },
      { label: 'Rudder Filtered Voltage', data: historicalData.rudderFilteredVoltage, borderColor: '#ffce56' },
    ],
  };

  const rudderPositionData = {
    labels: historicalData.labels,
    datasets: [
      { label: 'Rudder Position', data: historicalData.rudderPosition, borderColor: '#ff6384' },
      { label: 'Rudder Ref', data: historicalData.rudderRef, borderColor: '#cc65fe' },
    ],
  };

  const chartOptions = { responsive: true, animation: false, plugins: { legend: { position: 'top' } } };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Boat Data</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">GPS</Typography>
            <Typography>Latitude: {gps.location.latitude}</Typography>
            <Typography>Longitude: {gps.location.longitude}</Typography>
            <Typography>Course: {gps.course}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Rudder</Typography>
            <Typography>Position: {rudder.position}</Typography>
            <Typography>Ref: {boatData.settings.rudder.ref}</Typography>
            <Typography>Voltage: {rudder.voltage}</Typography>
            <Typography>Filtered Voltage: {rudder.filteredVoltage}</Typography>  
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Controller</Typography>
            <Typography>Output Min: {boatData.settings.controller.output.min}</Typography>
            <Typography>Output Max: {boatData.settings.controller.output.max}</Typography>
            <Typography>Error: {controller.error}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Route</Typography>
            <Typography>Goal Index: {boatData.settings.route.goalIndex}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
      
      <FormControlLabel
        control={<Checkbox checked={showGraphs.boatData} onChange={handleCheckboxChange} name="boatData" />}
        label="Show Boat Data Graph"
      />
      <FormControlLabel
        control={<Checkbox checked={showGraphs.rudderVoltage} onChange={handleCheckboxChange} name="rudderVoltage" />}
        label="Show Rudder Voltage Graph"
      />
      <FormControlLabel
        control={<Checkbox checked={showGraphs.rudderPosition} onChange={handleCheckboxChange} name="rudderPosition" />}
        label="Show Rudder Position Graph"
      />

      {showGraphs.boatData && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Boat Data Graph</Typography>
          <Line data={data} options={chartOptions} />
        </Card>
      )}
      
      {showGraphs.rudderVoltage && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Rudder Voltage Graph</Typography>
          <Line data={rudderData} options={chartOptions} />
        </Card>
      )}

      {showGraphs.rudderPosition && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Rudder Position Graph</Typography>
          <Line data={rudderPositionData} options={chartOptions} />
        </Card>
      )}
    </Container>
  );
};

export default BoatDataPage;