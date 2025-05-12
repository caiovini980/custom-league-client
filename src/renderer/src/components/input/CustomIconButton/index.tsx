import { CircularProgress, IconButton, IconButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export interface CustomIconButtonProps extends IconButtonProps {
  loading?: boolean;
}

const CustomIconButton = forwardRef<HTMLButtonElement, CustomIconButtonProps>(
  function CustomIconButton({ children, loading, ...iconButtonProps }, ref) {
    return (
      <IconButton
        ref={ref}
        {...iconButtonProps}
        disabled={iconButtonProps.disabled || loading}
        size="large"
      >
        {loading ? <CircularProgress size={16} /> : <>{children}</>}
      </IconButton>
    );
  },
);

export default CustomIconButton;
