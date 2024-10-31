import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Box, AppBar, Toolbar, Typography, TextField, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import MapComponent from './components/MapComponent';

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load API key from local storage if available
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    localStorage.setItem('apiKey', apiKey);
    alert('API Key saved successfully!');
  };

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
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {menuItems.map(({ text, route }) => (
                <ListItem button component={Link} to={route} key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            
            {/* API Key Input Section */}
            <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <TextField
                label="API Key"
                variant="outlined"
                fullWidth
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter API Key"
              />
              <Button variant="contained" color="primary" onClick={saveApiKey} sx={{ mt: 1 }}>
                Save API Key
              </Button>
            </Box>
          </Box>
        </Drawer>

        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Pass the API Key to MapComponent */}
            <Route path="/map" element={<MapComponent apiKey={apiKey} />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
