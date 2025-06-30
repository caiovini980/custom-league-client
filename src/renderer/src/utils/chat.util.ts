import { Theme } from '@mui/material';

export const getChatAvailabilityColor = (availability: string) => {
  return (t: Theme) => {
    return t.palette.chatAvailability[availability];
  };
};
