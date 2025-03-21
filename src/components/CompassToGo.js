import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useDataContext } from '../contexts/DataContext';

const CompassToGo = () => {
  const { compassHeading, compassEnabled, enableCompass, disableCompass } = useDataContext();

  const handleChange = (event) => {
    if (event.target.checked) {
      enableCompass();
    } else {
      disableCompass();
    }
  };

  const displayHeading = compassHeading !== null ? `${Math.round(compassHeading)}°` : 'N/A';

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={compassEnabled}
          onChange={handleChange}
          color="secondary"
        />
      }
      label={`Compass: ${displayHeading}`}
    />
  );
};

export default CompassToGo;
