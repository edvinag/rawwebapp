import React from 'react';
// import { FormControlLabel, Checkbox } from '@mui/material';
import { Button } from '@mui/material';
import { useDataContext } from '../contexts/DataContext';

const CompassToGo = () => {
  const { compassHeading, compassEnabled, enableCompass, disableCompass } = useDataContext();

  const displayHeading = compassHeading !== null ? `${Math.round(compassHeading)}°` : 'N/A';

  return (
    // <FormControlLabel
    //   control={
    //     <Checkbox
    //       checked={compassEnabled}
    //       onChange={handleChange}
    //       color="secondary"
    //     />
    //   }
    //   label={`Compass: ${displayHeading}`}
    // />
    <Button variant="contained" color="primary" onClick={enableCompass}>
      Compass: {displayHeading}
    </Button>
  );
};

export default CompassToGo;
