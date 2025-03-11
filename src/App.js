import React, { useState, useEffect } from 'react';
import { IconButton, Box, AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import MapComponent from './components/MapComponent';
import SettingsDrawer from './components/SettingsDrawer';
import { DataProvider, useDataContext } from './contexts/DataContext';
import { ApiProvider, useApi } from './contexts/SettingsContext';
import BoatDataPage from './components/BoatDataPage';
import SettingsJson from './components/SettingsJson';

import MapIcon from '@mui/icons-material/Map';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

// ✅ Import react-speech-recognition
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const AppContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [holdLineEnabled, setHoldLineEnabled] = useState(false); // Checkbox display state
  const { follow, setFollow, boatData } = useDataContext(); // ✅ Access boatData
  const { serviceUrl } = useApi(); // ✅ Get service URL from context

  // ✅ Speech recognition setup
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // ✅ Sync checkbox display state when boatData changes (without triggering fetch)
  useEffect(() => {
    if (boatData?.settings?.controller?.type) {
      setHoldLineEnabled(boatData.settings.controller.type === 'holdline');
    }
  }, [boatData]); // Syncs display only

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleFollowChange = (event) => {
    setFollow(event.target.checked);
  };

  // ✅ Handle Hold Line Checkbox when clicked (user interaction only)
  const handleHoldLineUserChange = async (event) => {
    const isChecked = event.target.checked;
    setHoldLineEnabled(isChecked); // Update display state immediately for responsiveness

    // Correct URLs based on state
    const url = isChecked
      ? `${serviceUrl}/setHoldLine` // When checked
      : `${serviceUrl}/controller?type=route`; // When unchecked

    try {
      const response = await fetch(url, { method: 'GET' }); // Perform GET request
      if (response.ok) {
        console.log(`Successfully called: ${url}`);
      } else {
        console.error(`Failed to call: ${url}`);
      }
    } catch (error) {
      console.error(`Error calling ${url}:`, error);
    }
  };

  // ✅ Detect "hold the line" and trigger API call if not already enabled
  useEffect(() => {
    console.log('🎙️ Transcript:', transcript);
    if (transcript.toLowerCase().includes('raw cat hold the line') && !holdLineEnabled) {
      console.log('🎙️ Voice command "hold the line" detected!');
      resetTranscript(); // Clear transcript to avoid retrigger

      // Trigger Hold Line
      setHoldLineEnabled(true); // Update checkbox visually
      const url = `${serviceUrl}/setHoldLine`; // API call to enable hold line mode
      fetch(url, { method: 'GET' })
        .then(response => {
          if (response.ok) console.log('🎙️ Hold Line activated via voice!');
          else console.error(`Failed to activate Hold Line via voice: ${url}`);
        })
        .catch(error => console.error(`Error activating Hold Line via voice: ${error}`));
    }
    if ((transcript.toLowerCase().includes('raw cat follow the route') || transcript.toLowerCase().includes('raw cat follow the root')) && holdLineEnabled) {
      console.log('🎙️ Voice command "follow the route" detected!');
      resetTranscript(); // Clear transcript to avoid retrigger

      // Trigger Hold Line
      setHoldLineEnabled(false); // Update checkbox visually
      const url = `${serviceUrl}/controller?type=route`;
      fetch(url, { method: 'GET' })
        .then(response => {
          if (response.ok) console.log('🎙️ Follow Route activated via voice!');
          else console.error(`Failed to activate Follow Route via voice: ${url}`);
        })
        .catch(error => console.error(`Error activating Follow Route via voice: ${error}`));
    }
  }, [transcript, holdLineEnabled, resetTranscript, serviceUrl]);

  // ✅ Auto-start listening for commands if supported
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.warn('Browser does not support speech recognition.');
    }
  }, [browserSupportsSpeechRecognition]);

  const menuItems = [
    { text: 'Map', route: '/', icon: <MapIcon /> },
    { text: 'Boat Data', route: '/data', icon: <DirectionsBoatIcon /> },
    { text: 'Settings', route: '/settings', icon: <SettingsJson /> },
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
            {/* Follow Boat Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={follow}
                  onChange={handleFollowChange}
                  color="default"
                />
              }
              label="Follow Boat"
            />
            {/* ✅ Hold Line Checkbox (reflect state, fetch on user click) */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={holdLineEnabled}
                  onChange={handleHoldLineUserChange} // User-driven fetch
                  color="default"
                />
              }
              label="Hold Line"
            />
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <SettingsDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} menuItems={menuItems} />

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<MapComponent />} />
            <Route path="/data" element={<BoatDataPage />} />
            <Route path="/settings" element={<SettingsJson />} />
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
