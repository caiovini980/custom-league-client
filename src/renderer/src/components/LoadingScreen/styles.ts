import { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeSx } from '../../styles';

interface Props {
  isBackDrop: boolean;
  full: boolean;
}

export const useStyles = makeSx((theme: Theme, props: Props) => {
  const { isBackDrop, full } = props;
  const isDark = theme.palette.mode === 'dark';

  const backdropStyle = {
    position: 'absolute',
    background: isBackDrop
      ? alpha(isDark ? theme.palette.grey[800] : theme.palette.grey[100], 0.7)
      : undefined,
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
      ...(full ? backdropStyle : undefined),
    },
  };
});
