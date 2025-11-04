import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';

interface ItemIconProps {
  itemId: number;
  iconSize?: number;
}

export const ItemIconDescription = ({
  itemId,
  iconSize = 22,
}: ItemIconProps) => {
  const { itemIcon } = useLeagueImage();
  const items = gameDataStore.items.use();
  const getDescription = () => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return '';

    return (
      <Stack direction={'column'} rowGap={1.5} sx={{ fontSize: '0.9rem' }}>
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
        <SquareIcon src={itemIcon(itemId)} size={iconSize} />
      </span>
    </Tooltip>
  );
};
