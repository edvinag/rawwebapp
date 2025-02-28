import React, { useState } from "react";
import { 
  Card, CardContent, Typography, Grid, Container, FormControlLabel, Checkbox 
} from "@mui/material";
import { DataProvider, useDataContext } from "../contexts/DataContext";
import Stream from "./Stream"; // Assuming you have a Stream component

const BoatDataPage = () => {
  const { boatData } = useDataContext(DataProvider);

  // Extract data safely
  const gps = boatData?.data?.gps || {};
  const rudder = boatData?.data?.rudder || {};
  const controller = boatData?.data?.controller || {};
  const route = boatData?.settings?.route || {};

  // Graph visibility state
  const [showGraphs, setShowGraphs] = useState({
    controllerError: true,
    rudderPosition: true,
    rudderVoltage: true
  });

  // Handle Checkbox Change
  const handleCheckboxChange = (event) => {
    setShowGraphs({ ...showGraphs, [event.target.name]: event.target.checked });
  };

  return (
    <Container 
      maxWidth="xl" 
      style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "row", 
        padding: "20px", 
        gap: "20px"
      }}
    >
      {/* Left Panel: Boat Data */}
      <Card style={{ width: "30%", height: "100%", overflowY: "auto", padding: "10px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Boat Data</Typography>
          
          {/* GPS Section */}
          <Card style={{ marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="h6">GPS</Typography>
              <Typography>Latitude: {gps.location?.latitude ?? "N/A"}</Typography>
              <Typography>Longitude: {gps.location?.longitude ?? "N/A"}</Typography>
              <Typography>Course: {gps.course ?? "N/A"}</Typography>
            </CardContent>
          </Card>

          {/* Rudder Section */}
          <Card style={{ marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="h6">Rudder</Typography>
              <Typography>Position: {rudder.position ?? "N/A"}</Typography>
              <Typography>Ref: {boatData.settings?.rudder?.ref ?? "N/A"}</Typography>
              <Typography>Voltage: {rudder.voltage ?? "N/A"}</Typography>
              <Typography>Filtered Voltage: {rudder.filteredVoltage ?? "N/A"}</Typography>
            </CardContent>
          </Card>

          {/* Controller Section */}
          <Card style={{ marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="h6">Controller</Typography>
              <Typography>Error: {controller.error ?? "N/A"}</Typography>
            </CardContent>
          </Card>

          {/* Route Section */}
          <Card>
            <CardContent>
              <Typography variant="h6">Route</Typography>
              <Typography>Goal Index: {route.goalIndex ?? "N/A"}</Typography>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Right Panel: Stream Graphs */}
      <Card style={{ flexGrow: 1, height: "100%", padding: "10px", overflowY: "auto" }}>
        <CardContent style={{ width: "100%", height: "100%" }}>
          <Typography variant="h4" gutterBottom>Live Data Streams</Typography>

          {/* Controller Error Graph */}
          {showGraphs.controllerError && (
            <Stream
              dataSources={[
                { label: "Controller Error", data: controller.error }
              ]}
            />
          )}

          {/* Rudder Position vs Ref Graph */}
          {showGraphs.rudderPosition && (
            <Stream
              dataSources={[
                { label: "Rudder Position", data: rudder.position },
                { label: "Rudder Ref", data: boatData.settings?.rudder?.ref }
              ]}
            />
          )}

          {/* Rudder Voltage vs Filtered Voltage Graph */}
          {showGraphs.rudderVoltage && (
            <Stream
              dataSources={[
                { label: "Rudder Voltage", data: rudder.voltage },
                { label: "Filtered Voltage", data: rudder.filteredVoltage }
              ]}
            />
          )}

          {/* Checkboxes to toggle graphs */}
          <FormControlLabel
            control={<Checkbox checked={showGraphs.controllerError} onChange={handleCheckboxChange} name="controllerError" />}
            label="Show Controller Error Graph"
          />
          <FormControlLabel
            control={<Checkbox checked={showGraphs.rudderPosition} onChange={handleCheckboxChange} name="rudderPosition" />}
            label="Show Rudder Position Graph"
          />
          <FormControlLabel
            control={<Checkbox checked={showGraphs.rudderVoltage} onChange={handleCheckboxChange} name="rudderVoltage" />}
            label="Show Rudder Voltage Graph"
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default BoatDataPage;
