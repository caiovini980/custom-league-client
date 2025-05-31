import { Grid, Typography } from '@mui/material';
import CustomButton from '../input/CustomButton';

interface ErrorScreenProps {
  mainMessage?: string;
  message?: string;
  onClickTry?: () => void;
  btnLabel?: string;
}

const ErrorScreen = ({
  mainMessage = 'Unknown Error',
  message,
  onClickTry,
  btnLabel = 'Reload',
}: ErrorScreenProps) => {
  return (
    <Grid
      container
      alignItems={'center'}
      justifyContent={'center'}
      direction={'column'}
      wrap={'nowrap'}
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
      }}
      rowGap={2}
    >
      <Grid>
        <Typography
          color={'textPrimary'}
          variant={'h5'}
          align={'center'}
          mb={1}
        >
          {mainMessage}
        </Typography>
        <Typography color={'textPrimary'} variant={'body1'}>
          {message}
        </Typography>
      </Grid>
      {onClickTry && (
        <Grid>
          <CustomButton
            id={'604be605-0bf4-4709-8a2d-ebe3ec8ec873'}
            sx={{ mb: 1 }}
            variant={'contained'}
            onClick={onClickTry}
          >
            {btnLabel}
          </CustomButton>
        </Grid>
      )}
    </Grid>
  );
};

export default ErrorScreen;
