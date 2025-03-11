// components/HoldLineToggle.js
import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useDataContext } from '../contexts/DataContext';
import { useApi } from '../contexts/SettingsContext';

const HoldLineToggle = () => {
  const [holdLineEnabled, setHoldLineEnabled] = useState(false);
  const { boatData } = useDataContext();
  const { serviceUrl } = useApi();

  // Sync checkbox display state when boatData changes (without triggering fetch)
  useEffect(() => {
    if (boatData?.settings?.controller?.type) {
      setHoldLineEnabled(boatData.settings.controller.type === 'holdline');
    }
  }, [boatData]);

  // Handle user interaction
  const handleHoldLineUserChange = async (event) => {
    const isChecked = event.target.checked;
    setHoldLineEnabled(isChecked); // Optimistically update UI

    const url = isChecked
      ? `${serviceUrl}/setHoldLine` // Enable hold line
      : `${serviceUrl}/controller?type=route`; // Disable hold line

    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        console.log(`Successfully called: ${url}`);
      } else {
        console.error(`Failed to call: ${url}`);
      }
    } catch (error) {
      console.error(`Error calling ${url}:`, error);
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={holdLineEnabled}
          onChange={handleHoldLineUserChange}
          color="default"
        />
      }
      label="Hold Line"
    />
  );
};

export default HoldLineToggle;
