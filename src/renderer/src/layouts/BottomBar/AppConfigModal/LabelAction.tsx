import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface LabelActionProps {
  label: string;
  helperText?: string | number;
  action: ReactNode;
  experimental?: boolean;
}

export const LabelAction = ({
  label,
  helperText,
  action,
  experimental = false,
}: LabelActionProps) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{
        borderBottom: '1px solid var(--mui-palette-divider)',
      }}
    >
      <Stack direction={'column'}>
        <Typography>{label}</Typography>
        {helperText && (
          <Typography variant={'body2'} color={'textSecondary'}>
            {helperText}
          </Typography>
        )}
        {experimental && (
          <Typography variant={'body2'} color={'warning'}>
            Experimental
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  );
};
