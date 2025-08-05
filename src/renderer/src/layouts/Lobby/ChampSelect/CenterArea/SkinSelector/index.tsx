import {
  Box,
  ButtonBase,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { LolChampSelectV1SkinCarouselSkins } from '@shared/typings/lol/response/lolChampSelectV1SkinCarouselSkins';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ChromaSelector } from '@render/layouts/Lobby/ChampSelect/CenterArea/SkinSelector/ChromaSelector';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

export const SkinSelector = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();
  const carouselRef = useRef<Carousel>(null);
  const skinId = champSelectStore.getCurrentSummonerData((s) => s.skinId, 0);

  const [skins, setSkins] = useState<LolChampSelectV1SkinCarouselSkins[]>([]);

  useLeagueClientEvent('/lol-champ-select/v1/skin-carousel-skins', (data) => {
    setSkins(data);
  });

  const onChangeSkin = useCallback(
    (index: number) => {
      const skin = skins[index];
      if (!skin.unlocked) return;
      handleChangeSkinId(skin.id);
    },
    [skins.map((s) => s.id).join(':')],
  );

  const handleChangeSkinId = (skinId: number) => {
    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      selectedSkinId: skinId,
    }).then();
  };

  const renderChroma = (skin: LolChampSelectV1SkinCarouselSkins) => {
    if (skin.unlocked && skin.childSkins.length) {
      return <ChromaSelector skin={skin} onChangeSkinId={handleChangeSkinId} />;
    }
    return '';
  };

  const index = useMemo(() => {
    const skinIndex = skins.findIndex((s) => {
      if (s.id === skinId) return true;
      return s.childSkins.some((cs) => cs.id === skinId);
    });
    return skinIndex === -1 ? 0 : skinIndex;
  }, [skins.map((s) => s.id).join(':'), skinId]);

  if (!skins.length) return;

  return (
    <Box
      width={'100%'}
      position={'relative'}
      sx={{
        '& .carousel-slider': {
          height: 180,
        },
      }}
    >
      <Carousel
        ref={carouselRef}
        selectedItem={index}
        centerMode
        infiniteLoop
        centerSlidePercentage={20}
        showStatus={false}
        showThumbs={false}
        swipeable={false}
        onChange={onChangeSkin}
      >
        {skins.map((s, index) => (
          <Tooltip
            key={s.id}
            title={renderChroma(s)}
            placement={'top'}
            slotProps={{
              tooltip: {
                sx: {
                  background: 'transparent',
                },
              },
            }}
            disableTouchListener
            disableFocusListener
          >
            <Paper
              component={ButtonBase}
              sx={{
                display: 'flex',
                width: '95%',
                height: 140,
                alignSelf: 'center',
                background: `linear-gradient(0deg, rgba(0,0,0,0.95) 5%, rgba(0,0,0,0) 100%), url(${lolGameDataImg(s.splashPath)})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: `grayscale(${s.unlocked ? 0 : 1})`,
              }}
              onClick={() => carouselRef.current?.moveTo(index)}
            >
              <Stack
                height={'100%'}
                direction={'row'}
                columnGap={2}
                justifyContent={'center'}
                alignItems={'flex-end'}
                p={2}
              >
                <Typography textAlign={'center'} fontSize={'0.8rem'}>
                  {s.name}
                </Typography>
              </Stack>
            </Paper>
          </Tooltip>
        ))}
      </Carousel>
    </Box>
  );
};
