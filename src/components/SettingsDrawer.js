import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/SettingsContext';
import { useDataContext } from '../contexts/DataContext'; // Import DataContext

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
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {menuItems.map(({ text, route }) => (
            <ListItem component={Link} to={route} key={text} sx={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        {/* Settings Input Section */}
        <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
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