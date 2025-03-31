import { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeSx } from '../../styles';

interface Props {
  isBackDrop: boolean;
}

export const useStyles = makeSx((theme: Theme, props: Props) => {
  const { isBackDrop } = props;
  const isDark = theme.palette.mode === 'dark';

  const backdropStyle = {
    position: 'absolute',
    background: alpha(
      isDark ? theme.palette.grey[800] : theme.palette.grey[100],
      0.7,
    ),
    top: 0,
    left: 0,
    height: '100% !important',
    zIndex: 99,
  };

  return {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...(isBackDrop ? backdropStyle : undefined),
    },
  };
});
