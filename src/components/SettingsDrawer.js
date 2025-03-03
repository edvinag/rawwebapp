import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Box, TextField, Button, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/SettingsContext';
import { useDataContext } from '../contexts/DataContext'; // Import DataContext

// Icons for menu items
import MapIcon from '@mui/icons-material/Map';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import SettingsIcon from '@mui/icons-material/Settings';

// Define an icon mapping based on menu text
const iconMap = {
  Map: <MapIcon />,
  'Boat Data': <DirectionsBoatIcon />,
  Settings: <SettingsIcon />,
};

const SettingsDrawer = ({ isDrawerOpen, toggleDrawer, menuItems }) => {
  const { apiKey, saveApiKey, serviceUrl, saveServiceUrl } = useApi(); // Access API and Service URL context

  const [inputApiKey, setInputApiKey] = useState(apiKey || '');
  const [inputServiceUrl, setInputServiceUrl] = useState(serviceUrl || 'http://localhost:5000');

  // Handlers for API Key
  const handleApiKeyChange = (event) => setInputApiKey(event.target.value);
  const saveApiKeyToContext = () => {
    saveApiKey(inputApiKey);
    alert('API Key saved successfully!');
  };

  // Handlers for Service URL
  const handleServiceUrlChange = (event) => setInputServiceUrl(event.target.value);
  const saveServiceUrlToContext = () => {
    saveServiceUrl(inputServiceUrl);
    alert('Service URL saved successfully!');
  };

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 280,
          bgcolor: '#f4f4f4',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {/* App Title */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Navigation</Typography>
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map(({ text, route }) => (
            <ListItem
              button
              component={Link}
              to={route}
              key={text}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'white',
                },
                padding: '12px 16px',
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: 'primary.main' }}>
                {iconMap[text] || <SettingsIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 2 }} />

        {/* Settings Input Section */}
        <Box
          sx={{ p: 2 }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }} fontWeight="bold">Settings</Typography>

          {/* API Key Input */}
          <TextField
            label="API Key"
            variant="outlined"
            fullWidth
            value={inputApiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter API Key"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={saveApiKeyToContext} fullWidth>
            Save API Key
          </Button>

          {/* Service URL Input */}
          <TextField
            label="Service URL"
            variant="outlined"
            fullWidth
            value={inputServiceUrl}
            onChange={handleServiceUrlChange}
            placeholder="Enter Service URL"
            sx={{ mt: 2, mb: 2 }}
          />
          <Button variant="contained" color="secondary" onClick={saveServiceUrlToContext} fullWidth>
            Save Service URL
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SettingsDrawer;
