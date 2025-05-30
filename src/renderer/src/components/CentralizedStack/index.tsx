import { Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

export const CentralizedStack = (props: PropsWithChildren) => {
  return (
    <Stack
      position={'relative'}
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100%'}
      width={'100%'}
      rowGap={2}
    >
      {props.children}
    </Stack>
  );
};
