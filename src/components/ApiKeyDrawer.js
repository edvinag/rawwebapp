// src/components/ApiKeyDrawer.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';

const ApiKeyDrawer = ({ isDrawerOpen, toggleDrawer, menuItems }) => {
  const { apiKey, saveApiKey } = useApi(); // Access API context here
  const [inputApiKey, setInputApiKey] = useState(apiKey || '');

  const handleApiKeyChange = (event) => {
    setInputApiKey(event.target.value);
  };

  const saveApiKeyToContext = () => {
    saveApiKey(inputApiKey);
    alert('API Key saved successfully!');
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
            value={inputApiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter API Key"
          />
          <Button variant="contained" color="primary" onClick={saveApiKeyToContext} sx={{ mt: 1 }}>
            Save API Key
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ApiKeyDrawer;
