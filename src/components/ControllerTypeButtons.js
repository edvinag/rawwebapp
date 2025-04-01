import React from 'react';
import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import RouteIcon from '@mui/icons-material/Route';
import HoldLineToggle from './HoldLineToggle';

const ControllerTypeButtons = ({
  enableCompass,
  enableRoute,
  currentControllerType,
  theme,
  compassHeading
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // To place the title above the buttons
        alignItems: 'center',
        gap: 1,
        border: '1px solid',
        borderColor: 'black', // Black border
        borderRadius: 2,
        p: 1,
        m: 1, // Increased margin
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={`Compass: ${compassHeading !== null ? `${Math.round(compassHeading)}°` : 'N/A'}`} arrow>
          <IconButton
            onClick={enableCompass}
            sx={{
              backgroundColor: currentControllerType === 'compass' ? theme.palette.success.main : theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: currentControllerType === 'compass' ? theme.palette.success.dark : theme.palette.primary.dark,
              },
              transition: 'background-color 0.3s ease',
              padding: '6px',
            }}
          >
            <ExploreIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <HoldLineToggle />

        <Tooltip title="Follow Route" arrow>
          <IconButton
            onClick={enableRoute}
            sx={{
              backgroundColor: currentControllerType === 'route' ? theme.palette.success.main : theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: currentControllerType === 'route' ? theme.palette.success.dark : theme.palette.primary.dark,
              },
              transition: 'background-color 0.3s ease',
              padding: '6px',
            }}
          >
            <RouteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ControllerTypeButtons;
