import { IconButton, Tooltip } from '@mui/material';
import { useDataContext } from '../contexts/DataContext';
import { useApi } from '../contexts/SettingsContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTheme } from '@mui/material/styles';

const HoldLineToggle = () => {
  const { setHoldLineEnabled, disableCompass, boatData } = useDataContext();
  const { serviceUrl } = useApi();
  const theme = useTheme();  // Accessing the theme

  const handleHoldLineUserChange = async () => {
    setHoldLineEnabled(true); 
    disableCompass();
    
    const url = `${serviceUrl}/setHoldLine`;

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

  const isActive = boatData?.settings?.controller?.type === 'holdline';
  const activeColor = theme.palette.success.main;
  const inactiveColor = theme.palette.primary.main;

  return (
    <Tooltip title="Hold The Line" arrow>
      <IconButton
        onClick={handleHoldLineUserChange}
        sx={{
          backgroundColor: isActive ? activeColor : inactiveColor,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: isActive ? theme.palette.success.dark : theme.palette.primary.dark,
          },
          transition: 'background-color 0.3s ease',
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HoldLineToggle;
