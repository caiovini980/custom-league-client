import { CircularProgress, IconButton, IconButtonProps } from '@mui/material';
import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';

export interface CustomIconButtonProps extends IconButtonProps {
  icon: IconType;
  loading?: boolean;
  iconProps?: IconBaseProps;
}

const CustomIconButton = React.forwardRef<
  HTMLButtonElement,
  CustomIconButtonProps
>(function CustomIconButton(
  { iconProps, icon: Icon, loading, ...iconButtonProps },
  ref,
) {
  return (
    <IconButton
      ref={ref}
      {...iconButtonProps}
      disabled={iconButtonProps.disabled || loading}
      size="large"
    >
      {loading ? (
        <CircularProgress size={16} />
      ) : (
        <Icon size={16} {...iconProps} />
      )}
    </IconButton>
  );
});

export default CustomIconButton;
