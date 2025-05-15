import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useMemo, useRef, useState} from 'react';
import { LolChampSelectV1SkinCarouselSkins } from '@shared/typings/lol/response/lolChampSelectV1SkinCarouselSkins';
import {
  Box,
  ButtonBase,
  Paper,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ChromaSelector } from '@render/layouts/Lobby/ChampSelect/CenterArea/SkinSelector/ChromaSelector';
import {useChampSelectContext} from "@render/layouts/Lobby/ChampSelect/ChampSelectContext";

export const SkinSelector = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();
  const carouselRef = useRef<Carousel>(null);
  const { currentPlayer } = useChampSelectContext()

  const [skins, setSkins] = useState<LolChampSelectV1SkinCarouselSkins[]>([]);

  useLeagueClientEvent('/lol-champ-select/v1/skin-carousel-skins', (data) => {
    setSkins(data);
  });

  const onChangeSkin = (index: number) => {
    const skin = skins[index];

    if (!skin.unlocked) return;

    const skinId = skin.id;

    handleChangeSkinId(skinId);
  };

  const handleChangeSkinId = (skinId: number) => {
    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      selectedSkinId: skinId,
    }).then((res) => {
      console.log(res.body);
    });
  };

  const renderChroma = (skin: LolChampSelectV1SkinCarouselSkins) => {
    if (skin.unlocked && skin.childSkins.length) {
      return <ChromaSelector skin={skin} onChangeSkinId={handleChangeSkinId} />;
    }
    return '';
  };

  const index = useMemo(() => {
    const skinIndex = skins.findIndex((s) => s.id === currentPlayer.selectedSkinId)
    return skinIndex === -1 ? 0 : skinIndex
  }, [skins.length, currentPlayer.selectedSkinId])

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
        onChange={(i) => onChangeSkin(i)}
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
