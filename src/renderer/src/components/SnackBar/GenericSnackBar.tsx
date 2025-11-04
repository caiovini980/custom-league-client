import { Box, Paper, Stack, Typography } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import {
  CustomContentProps,
  SharedProps,
  SnackbarContent,
  useSnackbar,
} from 'notistack';
import { forwardRef } from 'react';
import { FaTimes } from 'react-icons/fa';

export const GenericSnackBar = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { closeSnackbar } = useSnackbar();
    const { id, message, ...other } = props;

    const variant = other.variant ?? 'default';

    const variantColorMap: Record<
      NonNullable<SharedProps['variant']>,
      string
    > = {
      default: '#3d3d3d',
      success: '#519f28',
      error: '#dc0000',
      info: '#0092cc',
      warning: '#8a4d00',
    };

    return (
      <SnackbarContent ref={ref} {...other}>
        <Stack
          component={Paper}
          direction={'row'}
          width={'100%'}
          p={1}
          alignItems={'center'}
          overflow={'hidden'}
        >
          <Box
            position={'absolute'}
            left={0}
            top={0}
            bottom={0}
            width={4}
            borderRadius={1}
            sx={{
              background: variantColorMap[variant],
            }}
          />
          <Typography ml={1}>{message}</Typography>
          <Box flexGrow={1} />
          <CustomIconButton onClick={() => closeSnackbar(id)}>
            <FaTimes size={12} />
          </CustomIconButton>
        </Stack>
      </SnackbarContent>
    );
  },
);
