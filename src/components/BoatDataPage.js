import React from "react";
import { Card, CardContent, Typography, Grid, Container } from "@mui/material";
import { DataProvider, useDataContext } from "../contexts/DataContext";
import Stream from "./Stream"; // Assuming you have a Stream component

const BoatDataPage = () => {
  const { boatData } = useDataContext(DataProvider);

  // Extract GPS data safely
  const gpsData = boatData?.data?.gps || {};
  const course = gpsData.course ?? "N/A";
  const longitude = gpsData.location?.longitude ?? "N/A";
  const latitude = gpsData.location?.latitude ?? "N/A";

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
      {/* Left Section: Boat Data (Expandable in Future) */}
      <Card style={{ width: "30%", height: "100%", overflowY: "auto" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Boat Data</Typography>
          <Typography variant="h6"><strong>Course:</strong> {course}</Typography>
          <Typography variant="h6"><strong>Longitude:</strong> {longitude}</Typography>
          <Typography variant="h6"><strong>Latitude:</strong> {latitude}</Typography>
          {/* More data fields can be added here later */}
        </CardContent>
      </Card>

      {/* Right Section: Stream Graph */}
      <Card style={{ flexGrow: 1, height: "100%" }}>
        <CardContent style={{ width: "100%", height: "100%" }}>
          <Typography variant="h4" gutterBottom>Live Data Stream</Typography>
          <Stream
            dataSources={[
              { label: "Course", data: gpsData.course },
              { label: "Longitude", data: gpsData.location?.longitude }
            ]}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default BoatDataPage;
