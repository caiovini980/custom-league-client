import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MinigameButton } from '@render/layouts/CenterHub/News/MinigameButton';
import { LolActivityCenterV1Content_IdBladeItem } from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';
import { PropsWithChildren } from 'react';

interface NewsDescriptionProps {
  item: LolActivityCenterV1Content_IdBladeItem;
}

export const NewsDescription = ({ item }: NewsDescriptionProps) => {
  if (item.header.media) {
    return (
      <Container item={item}>
        <Box
          component={'img'}
          src={item.header.media.url}
          width={'fit-content !important'}
          height={item.header.media.dimensions.height}
        />
        <MinigameButton item={item} />
      </Container>
    );
  }
  return (
    <Container item={item}>
      <Typography fontSize={'2.4rem'} lineHeight={1}>
        {item.header?.title}
      </Typography>
      <Typography fontSize={'1.2rem'} lineHeight={1}>
        {item.header?.subtitle}
      </Typography>
    </Container>
  );
};

const Container = ({
  children,
  item,
}: PropsWithChildren<{
  item: LolActivityCenterV1Content_IdBladeItem;
}>) => {
  const desc = item.header.description.body.replace(/<\/?p[^>]*>/g, '');
  return (
    <Stack
      direction={'column'}
      position={'absolute'}
      bottom={15}
      left={15}
      width={'45%'}
      alignItems={'center'}
      rowGap={1}
      sx={{
        p: 1,
        background: (t) => alpha(t.palette.common.black, 0.4),
        '&:hover': {
          background: (t) => alpha(t.palette.common.black, 0.75),
        },
      }}
    >
      {children}
      {desc && (
        <Typography
          sx={{
            mt: 0.5,
            m: 0,
            fontSize: '1rem',
          }}
          dangerouslySetInnerHTML={{
            __html: desc,
          }}
        />
      )}
    </Stack>
  );
};
