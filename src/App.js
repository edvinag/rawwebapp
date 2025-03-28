// App.js or AppContent.js
import React, { useState, useMemo } from 'react';
import {
  IconButton,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import MapComponent from './components/MapComponent';
import SettingsDrawer from './components/SettingsDrawer';
import { DataProvider, useDataContext } from './contexts/DataContext';
import { ApiProvider } from './contexts/SettingsContext';
import BoatDataPage from './components/BoatDataPage';
import SettingsJson from './components/SettingsJson';
import HoldLineToggle from './components/HoldLineToggle';

import MapIcon from '@mui/icons-material/Map';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

const AppContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { follow, setFollow, boatData, enableRoute, enableCompass, compassHeading, pushDarkMode } = useDataContext();

  const isDarkMode = boatData?.settings?.rudder?.darkMode ?? false;

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  }), [isDarkMode]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setIsDrawerOpen(open);
  };

  const handleFollowChange = (event) => {
    setFollow(event.target.checked);
  };

  const menuItems = [
    { text: 'Map', route: '/', icon: <MapIcon /> },
    { text: 'Boat Data', route: '/data', icon: <DirectionsBoatIcon /> },
    { text: 'Settings', route: '/settings', icon: <SettingsJson /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                {/* Left Side */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">RawCat</Typography>
                  <Typography variant="subtitle1">
                    {boatData?.settings?.controller?.type === 'compass'
                      ? ' - follows the compass'
                      : boatData?.settings?.controller?.type === 'holdline'
                        ? ' - is holding the line'
                        : boatData?.settings?.controller?.type === 'route'
                          ? ' - is following the route'
                          : ''}
                  </Typography>
                </Box>

                {/* Right Side */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button variant="contained" color={boatData?.settings?.controller?.type === 'compass' ? "success" : "primary"} onClick={enableCompass}>
                    Compass: {compassHeading !== null ? `${Math.round(compassHeading)}°` : 'N/A'}
                  </Button>
                  <HoldLineToggle />
                  <Button variant="contained" color={boatData?.settings?.controller?.type === 'route' ? "success" : "primary"} onClick={enableRoute}>Follow route</Button>
                  <FormControlLabel
                    control={<Checkbox checked={follow} onChange={handleFollowChange} color="default" />}
                    label="Follow Boat"
                  />
                  <Button
                    variant="contained"
                    color={isDarkMode ? 'error' : 'primary'}
                    onClick={() => pushDarkMode(!isDarkMode)}
                  >
                    DarkMode
                  </Button>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          <SettingsDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} menuItems={menuItems} />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Routes>
              <Route path="/" element={<MapComponent />} />
              <Route path="/data" element={<BoatDataPage />} />
              <Route path="/settings" element={<SettingsJson />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
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
