import React, { useState } from 'react';
import { IconButton, Box, AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import MapComponent from './components/MapComponent';
import SettingsDrawer from './components/SettingsDrawer';
import { DataProvider, useDataContext } from './contexts/DataContext';
import { ApiProvider } from './contexts/SettingsContext';
import BoatDataPage from './components/BoatDataPage';

import MapIcon from '@mui/icons-material/Map';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

const AppContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { follow, setFollow } = useDataContext();

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
    { text: 'Map', route: '/', icon: <MapIcon /> },
    { text: 'Boat Data', route: '/data', icon: <DirectionsBoatIcon /> },
  ];

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* AppBar at the top */}
        <AppBar position="sticky">
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

        {/* Sidebar Drawer */}
        <SettingsDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} menuItems={menuItems} />

        {/* Main Content - Ensuring full height usage */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<MapComponent />} />
            <Route path="/data" element={<BoatDataPage />} />
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
