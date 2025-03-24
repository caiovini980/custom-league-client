import { Button } from '@mui/material';
import {
  OptionsObject,
  SnackbarAction,
  VariantType,
  useSnackbar as snackbar,
} from 'notistack';
import { createElement } from 'react';

interface SnackBarProps extends OptionsObject {
  message?: string;
  variant?: VariantType;
  duration?: number;
}

export const useSnackNotification = () => {
  const propsDefault: SnackBarProps = {
    message: 'Ação realizada com sucesso',
    duration: 3000,
    variant: 'success',
  };
  const { enqueueSnackbar, closeSnackbar } = snackbar();

  const action: SnackbarAction = (key) => {
    return createElement(
      Button,
      {
        variant: 'text',
        color: 'inherit',
        onClick: () => closeSnackbar(key),
      },
      'Close',
    );
  };

  const show = (props?: SnackBarProps) => {
    enqueueSnackbar(props?.message || propsDefault.message, {
      variant: props?.variant || propsDefault.variant,
      autoHideDuration: props?.duration || propsDefault.duration,
      action,
      ...props,
    });
  };

  const snackSuccess = (message: string, option?: OptionsObject) => {
    enqueueSnackbar(message, {
      autoHideDuration: propsDefault.duration,
      action,
      ...option,
      variant: 'success',
    });
  };

  const snackError = (message: string, option?: OptionsObject) => {
    enqueueSnackbar(message, {
      autoHideDuration: propsDefault.duration ?? 10000,
      action,
      ...option,
      variant: 'error',
    });
  };

  const snackWarning = (message: string, option?: OptionsObject) => {
    enqueueSnackbar(message, {
      autoHideDuration: propsDefault.duration,
      action,
      ...option,
      variant: 'warning',
    });
  };

  return { show, snackError, snackSuccess, snackWarning };
};
