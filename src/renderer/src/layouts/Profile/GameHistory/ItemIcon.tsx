import { SquareIcon } from '@render/components/SquareIcon';
import { useStore } from '@render/zustand/store';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';

interface ItemIconProps {
  itemId: number;
  src: string;
}

export const ItemIcon = ({ itemId, src }: ItemIconProps) => {
  const items = useStore().gameData.items();
  const getDescription = () => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return '';

    return (
      <Stack
        direction={'column'}
        rowGap={1.5}
        sx={{ p: 2, fontSize: '0.9rem' }}
      >
        <Typography textAlign={'center'} fontSize={'1.2rem'}>
          {item.name}
        </Typography>
        <Divider flexItem />
        <Box dangerouslySetInnerHTML={{ __html: item.description }} />
      </Stack>
    );
  };

  return (
    <Tooltip
      title={getDescription()}
      placement={'bottom'}
      arrow
      disableInteractive
    >
      <span>
        <SquareIcon src={src} size={38} />
      </span>
    </Tooltip>
  );
};
