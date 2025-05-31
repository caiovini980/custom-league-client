import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import { FaExclamationTriangle, FaInfo } from 'react-icons/fa';
import { FaExclamationCircle } from 'react-icons/fa';
import useStyles from './styles';
import { AlertBoxProps, AlertType } from './types';

export const AlertBox = ({
  type,
  message,
  fullWidth = false,
  align = 'center',
  isBlank = false,
}: AlertBoxProps) => {
  const classes = useStyles({ type, fullWidth, align, isBlank });

  const getIcon: { [key in AlertType]: React.ReactNode } = {
    info: <FaInfo />,
    warning: <FaExclamationTriangle />,
    error: <FaExclamationCircle />,
  };

  return (
    <Paper variant={'outlined'} elevation={0} sx={classes('paper')}>
      <Box sx={classes('container')}>
        {getIcon[type]}
        <Typography sx={classes('alertText')}>{message}</Typography>
      </Box>
    </Paper>
  );
};
