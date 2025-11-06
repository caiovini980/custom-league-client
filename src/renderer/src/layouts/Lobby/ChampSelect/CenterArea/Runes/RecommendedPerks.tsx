import { ButtonBase, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { SquareIcon } from '@render/components/SquareIcon';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { LolPerksV1Pages_Id } from '@shared/typings/lol/request/lolPerksV1Pages_Id';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id } from '@shared/typings/lol/response/lolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id';
import { useState } from 'react';

interface RecommendedPerksProps {
  open: boolean;
  onClose: () => void;
  championId: number;
  position: string;
  mapId: number;
  onSelectPerk?: (runePageId: number) => void;
}

export const RecommendedPerks = ({
  open,
  onClose,
  onSelectPerk,
  championId,
  position,
  mapId,
}: RecommendedPerksProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { loadChampionBackgroundImg, lolGameDataImg, spellIcon } =
    useLeagueImage();

  const champions = gameDataStore.champions.use();

  const [recommendedPerk, setRecommendedPerk] = useState<
    LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id[]
  >([]);

  const backgroundOffsetPerc = 25;
  const iconSize = {
    keystone: 120,
    secondary: 30,
    ternary: 25,
    spell: 30,
  };

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-perks/v1/recommended-pages/champion/{digits}/position/{string}/map/{digits}',
      championId,
      position.toLowerCase() || 'NONE',
      mapId,
    ),
    (data) => {
      setRecommendedPerk(data);
    },
  );

  const backgroundImgSx = {
    content: "''",
    background: `url(${loadChampionBackgroundImg('splashPath', championId)})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '400px 0px',
    transform: 'scaleX(-1)',
    zIndex: -1,
    inset: 0,
    position: 'absolute',
    maskImage: `linear-gradient(to right, transparent ${100 - backgroundOffsetPerc - 5}%, black ${100 - backgroundOffsetPerc + 3}%)`,
  };

  const onClickRecommendedPerk = (index: number) => {
    const perk = recommendedPerk[index];
    const championName = champions.find((c) => c.id === championId)?.name ?? '';
    const data: LolPerksV1Pages_Id = {
      isTemporary: true,
      isRecommendationOverride: false,
      name: `${championName} - ${perk.keystone.name}`,
      primaryStyleId: perk.primaryPerkStyleId,
      subStyleId: perk.secondaryPerkStyleId,
      selectedPerkIds: perk.perks.map((p) => p.id),
      recommendationChampionId: perk.recommendationChampionId,
      runeRecommendationId: perk.recommendationId,
      recommendationIndex: index,
      order: 0,
    };

    /*
    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      spell1Id: perk.summonerSpellIds[0],
      spell2Id: perk.summonerSpellIds[1],
    }).then();
         */

    makeRequest('POST', '/lol-perks/v1/pages', data).then((res) => {
      if (res.ok) {
        // In this case, res.body is LolPerksV1Pages only and not a list
        const id = (res.body as unknown as LolPerksV1Pages).id;
        makeRequest('PUT', '/lol-perks/v1/currentpage', id).then();
        onSelectPerk?.(id);
        onClose();
      }
    });
  };

  return (
    <CustomDialog
      open={open}
      fullWidth
      className={'theme-dark'}
      maxWidth={'lg'}
      handleClose={onClose}
      actionsComponent={<div />}
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
          height: '70vh',
          zIndex: 0,
          pl: `${backgroundOffsetPerc}%`,
          pr: 2,
          pt: '60px',
          pb: 2,
          '&::before': backgroundImgSx,
          '&::after': {
            ...backgroundImgSx,
            filter: ' blur(20px)',
            backgroundSize: '20px 100%',
            backgroundRepeat: 'repeat-x',
            maskImage: `linear-gradient(to left, transparent ${backgroundOffsetPerc - 2}%, black ${backgroundOffsetPerc}%)`,
          },
        },
      }}
    >
      <CustomDialogCloseFloatingButton handleClose={onClose} />
      <Stack
        direction={'row'}
        height={'100%'}
        width={'100%'}
        justifyContent={'space-between'}
        sx={{
          position: 'relative',
          zIndex: 0,
          overflow: 'auto',
        }}
      >
        {recommendedPerk.map((rp, i) => {
          return (
            <Stack
              key={`${championId}-${position}-${mapId}-${i}`}
              onClick={() => onClickRecommendedPerk(i)}
              component={ButtonBase}
              direction={'column'}
              alignItems={'center'}
              rowGap={1.5}
              sx={{
                p: 1,
                border: '1px solid var(--mui-palette-divider)',
              }}
            >
              <CircularIcon
                src={lolGameDataImg(rp.keystone.iconPath)}
                size={iconSize.keystone}
              />
              <Typography variant={'h5'}>{rp.keystone.name}</Typography>
              <Typography variant={'caption'} color={'textSecondary'}>
                {rp.keystone.recommendationDescriptor}
              </Typography>
              <Typography
                dangerouslySetInnerHTML={{ __html: rp.keystone.shortDesc }}
              />
              <Stack direction={'row'} columnGap={2}>
                <CircularIcon
                  src={lolGameDataImg(rp.perks[4].iconPath)}
                  size={iconSize.secondary}
                />
                <CircularIcon
                  src={lolGameDataImg(rp.perks[5].iconPath)}
                  size={iconSize.secondary}
                />
              </Stack>
              <Stack direction={'row'} columnGap={2}>
                <CircularIcon
                  src={lolGameDataImg(rp.perks[6].iconPath)}
                  size={iconSize.ternary}
                />
                <CircularIcon
                  src={lolGameDataImg(rp.perks[7].iconPath)}
                  size={iconSize.ternary}
                />
                <CircularIcon
                  src={lolGameDataImg(rp.perks[8].iconPath)}
                  size={iconSize.ternary}
                />
              </Stack>
              <Stack direction={'row'} columnGap={2} display={'none'}>
                <SquareIcon
                  src={spellIcon(rp.summonerSpellIds[0])}
                  size={iconSize.spell}
                />
                <SquareIcon
                  src={spellIcon(rp.summonerSpellIds[1])}
                  size={iconSize.spell}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </CustomDialog>
  );
};
