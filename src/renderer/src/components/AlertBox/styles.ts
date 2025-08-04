import { Theme } from '@mui/material';
import { alpha, PaletteColor } from '@mui/material/styles';
import { makeSx } from '@render/styles/makeSx';
import { AlertBoxStyleProps, AlertType } from './types';

const useStyles = makeSx((theme: Theme, props: AlertBoxStyleProps) => {
  const isDark = theme.palette.mode === 'dark';

  const color: { [key in AlertType]: PaletteColor } = {
    info: theme.palette.info,
    error: theme.palette.error,
    warning: theme.palette.warning,
  };

  return {
    paperBlank: {
      background: 'transparent !important',
      border: 0,
    },
    paper: {
      background: props.isBlank
        ? 'transparent'
        : alpha(color[props.type].light, 0.2),
      borderColor: color[props.type].dark,
      padding: 1,
      width: props.fullWidth ? '100%' : 'auto',
      border: props.isBlank ? 0 : undefined,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: props.fullWidth ? props.align : 'flex-start',
      '& > svg': {
        width: 40,
        color: isDark ? color[props.type].light : color[props.type].dark,
      },
    },
    alertText: {
      color: isDark ? color[props.type].light : color[props.type].dark,
      flex: props.fullWidth ? undefined : 1,
    },
  };
});

export default useStyles;
