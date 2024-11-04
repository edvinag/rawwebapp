// src/App.js
import React, { useState } from 'react';
import { IconButton, Box, AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import MapComponent from './components/MapComponent';
import ApiKeyDrawer from './components/ApiKeyDrawer';
import { DataProvider } from './contexts/DataContext';
import { ApiProvider } from './contexts/ApiContext';

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTargetMarker, setShowTargetMarker] = useState(true); // New state for TargetMarker

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', route: '/' },
    { text: 'Map', route: '/map' },
  ];

  return (
    <ApiProvider>
      <DataProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  My Leaflet App
                </Typography>
                {/* Checkbox to toggle TargetMarker */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showTargetMarker}
                      onChange={() => setShowTargetMarker(!showTargetMarker)}
                      color="default"
                    />
                  }
                  label="Show Target Marker"
                />
              </Toolbar>
            </AppBar>

            <ApiKeyDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} menuItems={menuItems} />

            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapComponent showTargetMarker={showTargetMarker} />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </DataProvider>
    </ApiProvider>
  );
};

export default App;
