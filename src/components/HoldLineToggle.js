import { Button } from '@mui/material';
import { useDataContext } from '../contexts/DataContext';
import { useApi } from '../contexts/SettingsContext';

const HoldLineToggle = () => {
  const { setHoldLineEnabled, disableCompass} = useDataContext();
  const { serviceUrl } = useApi();

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

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleHoldLineUserChange}
    >
      Hold The Line
    </Button>
  );
};

export default HoldLineToggle;
