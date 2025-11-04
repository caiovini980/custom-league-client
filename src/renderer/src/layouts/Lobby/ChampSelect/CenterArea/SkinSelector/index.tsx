import {
  Box,
  ButtonBase,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { CustomCarousel } from '@render/components/CustomCarousel';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ChromaSelector } from '@render/layouts/Lobby/ChampSelect/CenterArea/SkinSelector/ChromaSelector';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { LolChampSelectV1SkinCarouselSkins } from '@shared/typings/lol/response/lolChampSelectV1SkinCarouselSkins';
import { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

export const SkinSelector = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();
  const carouselRef = useRef<Slider>(null);
  const summonerSkinId = champSelectStore.getCurrentSummonerData(
    (s) => s.skinId,
    0,
  );

  const [skinId, setSkinId] = useState(0);
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
    setSkinId(skinId);
    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      selectedSkinId: skinId,
    }).then();
  };

  const renderChroma = (skin: LolChampSelectV1SkinCarouselSkins) => {
    const isCurrentSkin =
      skin.id === skinId || skin.childSkins.some((cs) => cs.id === skinId);
    if (skin.unlocked && skin.childSkins.length && isCurrentSkin) {
      return <ChromaSelector skin={skin} onChangeSkinId={handleChangeSkinId} />;
    }
    return '';
  };

  const goToSlide = (index: number) => {
    carouselRef.current?.slickGoTo(index);
  };

  useEffect(() => {
    if (!skins.length && !skinId) return;
    const skinIndex = skins.findIndex((s) => {
      if (s.id === skinId) return true;
      return s.childSkins.some((cs) => cs.id === skinId);
    });
    if (skinIndex !== -1) {
      carouselRef.current?.forceUpdate();
      setTimeout(() => {
        goToSlide(skinIndex);
      }, 300);
    }
  }, [skins.map((s) => s.id).join(':'), skinId]);

  useEffect(() => {
    setSkinId(summonerSkinId);
  }, [summonerSkinId]);

  if (!skins.length) return;

  return (
    <Box position={'relative'} className={'slider-container'}>
      <CustomCarousel
        ref={carouselRef}
        centerMode
        infinite
        afterChange={onChangeSkin}
        slidesToShow={5}
        focusOnSelect
        arrows
        responsive={[
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 1250,
            settings: {
              slidesToShow: 1,
            },
          },
        ]}
      >
        {skins.map((s) => (
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
            <ButtonBase>
              <Paper
                sx={{
                  height: 160,
                  width: '90%',
                  margin: '0 auto',
                  background: `linear-gradient(0deg, rgba(0,0,0,0.95) 5%, rgba(0,0,0,0) 100%), url(${lolGameDataImg(s.splashPath)})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  filter: `grayscale(${s.unlocked ? 0 : 1})`,
                }}
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
            </ButtonBase>
          </Tooltip>
        ))}
      </CustomCarousel>
    </Box>
  );
};
