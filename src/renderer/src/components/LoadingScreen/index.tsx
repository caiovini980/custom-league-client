import {
  CircularProgress,
  CircularProgressProps,
  Container,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { useStyles } from './styles';

type Colors = CircularProgressProps['color'] | TypographyProps['color'];

export interface LoadingScreenProps {
  loading?: boolean;
  loadingText?: string;
  height?: number | string;
  backdrop?: boolean;
  fullArea?: boolean;
  color?: Colors;
}

export const LoadingScreen = ({
  loading = true,
  loadingText,
  height = 150,
  backdrop = false,
  fullArea = false,
  color,
}: LoadingScreenProps) => {
  const { localTranslate } = useLocalTranslate();
  const classes = useStyles({ isBackDrop: backdrop, full: fullArea });

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
      <Typography color={color}>
        {loadingText ?? localTranslate('loading')}
      </Typography>
    </Container>
  );
};
