import { Box } from '@mui/material';
import { LolActivityCenterV1Content_IdBladeItem } from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';

interface NewsMediaProps {
  item: LolActivityCenterV1Content_IdBladeItem;
}

export const NewsMedia = ({ item }: NewsMediaProps) => {
  if (item.backdrop.background.type === 'video') {
    const getVideoSource = (item: LolActivityCenterV1Content_IdBladeItem) => {
      if (!item.backdrop.background.sources) return null;
      return item.backdrop.background.sources[0];
    };

    return (
      <Box
        component={'video'}
        width={'100%'}
        height={'100%'}
        autoPlay
        loop
        src={getVideoSource(item)?.src}
        sx={{
          objectFit: 'cover',
        }}
      />
    );
  }

  if (item.backdrop.background.type === 'image') {
    return (
      <Box
        component={'img'}
        width={'100%'}
        height={'100%'}
        src={item.backdrop.background.url}
      />
    );
  }

  return null;
};
