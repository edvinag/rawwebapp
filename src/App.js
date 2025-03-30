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
import Tooltip from '@mui/material/Tooltip';
import ExploreIcon from '@mui/icons-material/Explore';
import RouteIcon from '@mui/icons-material/Route';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';


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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
  {/* Compass Button */}
  <Tooltip title={`Compass: ${compassHeading !== null ? `${Math.round(compassHeading)}°` : 'N/A'}`} arrow>
    <IconButton
      onClick={enableCompass}
      sx={{
        backgroundColor: boatData?.settings?.controller?.type === 'compass' ? theme.palette.success.main : theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': { backgroundColor: boatData?.settings?.controller?.type === 'compass' ? theme.palette.success.dark : theme.palette.primary.dark },
        transition: 'background-color 0.3s ease'
      }}
    >
      <ExploreIcon />
    </IconButton>
  </Tooltip>

  {/* Hold Line Button */}
  <HoldLineToggle />

  {/* Route Button */}
  <Tooltip title="Follow Route" arrow>
    <IconButton
      onClick={enableRoute}
      sx={{
        backgroundColor: boatData?.settings?.controller?.type === 'route' ? theme.palette.success.main : theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': { backgroundColor: boatData?.settings?.controller?.type === 'route' ? theme.palette.success.dark : theme.palette.primary.dark },
        transition: 'background-color 0.3s ease'
      }}
    >
      <RouteIcon />
    </IconButton>
  </Tooltip>
</Box>

                  
                  <FormControlLabel
                    control={<Checkbox checked={follow} onChange={handleFollowChange} color="default" />}
                    label="Follow Boat"
                  />
                  <Tooltip title="Toggle Dark Mode" arrow>
                    <IconButton
                      onClick={() => pushDarkMode(!isDarkMode)}
                      sx={{
                        backgroundColor: isDarkMode ? theme.palette.success.main : theme.palette.primary.main,
                        color: theme.palette.common.white,
                        '&:hover': { backgroundColor: isDarkMode ? theme.palette.success.dark : theme.palette.primary.dark },
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                  </Tooltip>
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
