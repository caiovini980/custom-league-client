import { Box, Stack } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { withSystemReady } from '@render/hoc/withSystemReady';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { NewsActions } from '@render/layouts/CenterHub/News/NewsActions';
import { NewsDescription } from '@render/layouts/CenterHub/News/NewsDescription';
import { NewsMedia } from '@render/layouts/CenterHub/News/NewsMedia';
import { centerHubStore } from '@render/zustand/stores/centerHubStore';
import { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';

export const News = withSystemReady('activeCenter', () => {
  const { makeRequest } = useLeagueClientRequest();

  const news = centerHubStore.news.use();

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-activity-center/v1/content/{id}', 'info-hub'),
      undefined,
    ).then((res) => {
      if (res.ok) {
        centerHubStore.news.set(res.body);
      }
    });
  }, []);

  if (!news) {
    return (
      <CentralizedStack>
        <LoadingScreen />
      </CentralizedStack>
    );
  }

  return (
    <Box
      height={'100%'}
      flexShrink={0}
      width={'100%'}
      position={'relative'}
      sx={{
        '& .slider, .slide, .carousel-root, .carousel-slider, .slider-wrapper':
          {
            height: '100%',
          },
        '& li.slide': {
          height: 'auto',
        },
      }}
    >
      <Carousel
        key={news.blades[0].items.length}
        autoPlay={true}
        infiniteLoop
        stopOnHover
        showStatus={false}
        showThumbs={false}
        swipeable={false}
        interval={5000}
      >
        {news.blades[0].items.map((item, i) => {
          return (
            <Stack
              key={i}
              direction={'column'}
              position={'relative'}
              alignItems={'center'}
              height={'100%'}
            >
              <NewsDescription item={item} />
              <NewsMedia item={item} />
              <NewsActions item={item} />
            </Stack>
          );
        })}
      </Carousel>
    </Box>
  );
});
