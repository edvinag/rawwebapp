import React, { useState } from 'react';
import { IconButton, Box, AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import MapComponent from './components/MapComponent';
import SettingsDrawer from './components/SettingsDrawer';
import { DataProvider, useDataContext } from './contexts/DataContext';
import { ApiProvider } from './contexts/SettingsContext';
import Stream from './components/Stream';
// import BoatDataPage from './components/BoatDataPage'; // Import BoatDataPage component

const AppContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { follow, setFollow } = useDataContext(); // Access follow state from DataContext

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleFollowChange = (event) => {
    setFollow(event.target.checked);
  };

  const menuItems = [
    { text: 'Map', route: '/' },
    { text: 'Stream', route: '/stream' }, // Add menu item for Boat Data
  ];
  const { boatData } = useDataContext(DataProvider);

  const dataSources = [
    {
      label: "Course",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      borderDash: [8, 4],
      getDataPoint: () => {
        const course = boatData?.data?.gps?.course;
        return course ? { x: Date.now(), y: course } : null;
      },
    },
    {
      label: "Longitude",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgb(54, 162, 235)",
      cubicInterpolationMode: "monotone",
      getDataPoint: () => {
        const longitude = boatData?.data?.gps?.location?.longitude;
        return longitude ? { x: Date.now(), y: longitude } : null;
      },
    }
  ];

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              RawCat
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={follow}
                  onChange={handleFollowChange}
                  color="default"
                />
              }
              label="Follow the boat"
            />
          </Toolbar>
        </AppBar>

        <SettingsDrawer
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          menuItems={menuItems}
        />

        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MapComponent />} />
            <Route path="/stream" element={<Stream dataSources={dataSources} />} /> Add route for BoatDataPage
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

const App = () => (
  <ApiProvider>
    <DataProvider>
      <AppContent />
    </DataProvider>
  </ApiProvider>
);

export default App;