import { Stack, Typography } from '@mui/material';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { useChampSelectTimer } from '@render/hooks/useChampSelectTimer';

export const Timer = () => {
  const { session, currentAction } = useChampSelectContext();
  const { title, time } = useChampSelectTimer(session, currentAction);

  return (
    <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
      <Typography fontSize={'2.0rem'} lineHeight={1}>
        {title}
      </Typography>
      <Typography fontSize={'1.8rem'} lineHeight={1}>
        {time}
      </Typography>
    </Stack>
  );
};
