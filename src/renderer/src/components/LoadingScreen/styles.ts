import { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeSx } from '../../styles';

interface Props {
  isBackDrop: boolean;
  full: boolean;
}

export const useStyles = makeSx((theme: Theme, props: Props) => {
  const { isBackDrop, full } = props;

  const backdropStyle = {
    position: 'absolute',
    background: isBackDrop ? alpha(theme.palette.common.black, 0.5) : undefined,
    color: 'var(--mui-palette-common-white)',
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
