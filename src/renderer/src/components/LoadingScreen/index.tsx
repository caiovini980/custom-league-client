import {
  CircularProgress,
  CircularProgressProps,
  Container,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useStyles } from './styles';

type Colors = CircularProgressProps['color'] | TypographyProps['color'];

export interface LoadingScreenProps {
  loading?: boolean;
  loadingText?: string;
  height?: number | string;
  backdrop?: boolean;
  color?: Colors;
}

export const LoadingScreen = ({
  loading = true,
  loadingText = 'Carregando dados...',
  height = 150,
  backdrop = false,
  color,
}: LoadingScreenProps) => {
  const classes = useStyles({ isBackDrop: backdrop });

  if (!loading) return null;

  return (
    <Container
      maxWidth={false}
      sx={classes('root')}
      style={{
        height,
      }}
    >
      <CircularProgress
        size={50}
        color={color as CircularProgressProps['color']}
      />
      <Typography color={color}>{loadingText}</Typography>
    </Container>
  );
};
