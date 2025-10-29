import { Box, Stack, Typography } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { FaMinus } from 'react-icons/fa6';
import { useViewActionButtonContext } from '../ViewActionButton';

interface ConversationHeaderProps {
  gameName?: string;
  gameTag?: string;
}

export const ConversationHeader = ({
  gameName,
  gameTag,
}: ConversationHeaderProps) => {
  const actionButtonContext = useViewActionButtonContext();

  const onClose = () => {
    actionButtonContext.forceClose();
  };

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      height={40}
      width={'100%'}
      flexShrink={0}
      columnGap={1}
      sx={{
        px: 1,
        borderBottom: '1px solid var(--mui-palette-divider)',
      }}
    >
      <Stack direction={'column'}>
        <Typography>{gameName}</Typography>
        {gameTag && (
          <Typography fontSize={'0.7rem'} color={'textDisabled'}>
            #{gameTag}
          </Typography>
        )}
      </Stack>
      <Box flexGrow={1} />
      <CustomIconButton sx={{ p: 0.5 }} onClick={onClose}>
        <FaMinus size={18} />
      </CustomIconButton>
    </Stack>
  );
};
