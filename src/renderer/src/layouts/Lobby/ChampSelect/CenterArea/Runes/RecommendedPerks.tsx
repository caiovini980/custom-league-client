import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id } from '@shared/typings/lol/response/lolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id';
import CustomDialog from '@render/components/CustomDialog';
import { FaTimes } from 'react-icons/fa';
import { CustomIconButton } from '@render/components/input';
import { ButtonBase, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useStore } from '@render/zustand/store';
import { LolPerksV1Pages_Id } from '@shared/typings/lol/request/lolPerksV1Pages_Id';

interface RecommendedPerksProps {
  perkToChangeId?: number;
  open: boolean;
  onClose: () => void;
  championId: number;
  position: string;
  mapId: number;
  onSelectPerk?: () => void;
}

export const RecommendedPerks = ({
  open,
  onClose,
  onSelectPerk,
  championId,
  position,
  mapId,
  perkToChangeId,
}: RecommendedPerksProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { loadChampionBackgroundImg, lolGameDataImg, spellIcon } =
    useLeagueImage();

  const champions = useStore().gameData.champions();

  const [recommendedPerk, setRecommendedPerk] = useState<
    LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id[]
  >([]);

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
      position.toLowerCase(),
      mapId,
    ),
    (data) => {
      setRecommendedPerk(data);
    },
  );

  const backgroundImgSx = {
    content: "''",
    background: `url(${loadChampionBackgroundImg('splashPath', championId)})`,
    backgroundSize: '160% 160%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0px -65px',
    transform: 'scaleX(-1)',
    zIndex: -1,
    inset: 0,
    position: 'absolute',
  };

  const onClickRecommendedPerk = (index: number) => {
    const perk = recommendedPerk[index];
    const championName = champions.find((c) => c.id === championId)?.name ?? '';
    const data: LolPerksV1Pages_Id = {
      isTemporary: true,
      name: `${championName}: ${perk.keystone.name}`,
      primaryStyleId: perk.primaryPerkStyleId,
      subStyleId: perk.secondaryPerkStyleId,
      selectedPerkIds: perk.perks.map((p) => p.id),
    };

    onClose();

    if (perkToChangeId) {
      makeRequest(
        'PUT',
        buildEventUrl('/lol-perks/v1/pages/{digits}', perkToChangeId),
        data,
      ).then(() => onSelectPerk?.());
    } else {
      makeRequest('POST', '/lol-perks/v1/pages', data).then(() =>
        onSelectPerk?.(),
      );
    }
  };

  return (
    <CustomDialog
      open={open}
      fullWidth
      maxWidth={'lg'}
      handleClose={onClose}
      actionsComponent={<div />}
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
          height: '60vh',
          zIndex: 0,
          pl: '25%',
          pr: 2,
          pt: '60px',
          pb: 2,
          '&::before': backgroundImgSx,
          '&::after': {
            ...backgroundImgSx,
            filter: ' blur(50px)',
            maskImage: 'linear-gradient(to left, transparent 20%, black 25%)',
          },
        },
      }}
    >
      <CustomIconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
        }}
      >
        <FaTimes size={20} />
      </CustomIconButton>
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
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <img
                src={lolGameDataImg(rp.keystone.iconPath)}
                alt={rp.keystone.name}
                style={{
                  width: iconSize.keystone,
                  height: iconSize.keystone,
                }}
              />
              <Typography variant={'h5'}>{rp.keystone.name}</Typography>
              <Typography variant={'caption'} color={'textSecondary'}>
                {rp.keystone.recommendationDescriptor}
              </Typography>
              <Typography
                dangerouslySetInnerHTML={{ __html: rp.keystone.shortDesc }}
              />
              <Stack direction={'row'} columnGap={2}>
                <img
                  src={lolGameDataImg(rp.perks[4].iconPath)}
                  alt={''}
                  style={{
                    width: iconSize.secondary,
                    height: iconSize.secondary,
                  }}
                />
                <img
                  src={lolGameDataImg(rp.perks[5].iconPath)}
                  alt={''}
                  style={{
                    width: iconSize.secondary,
                    height: iconSize.secondary,
                  }}
                />
              </Stack>
              <Stack direction={'row'} columnGap={2}>
                <img
                  src={lolGameDataImg(rp.perks[6].iconPath)}
                  alt={''}
                  style={{
                    width: iconSize.ternary,
                    height: iconSize.ternary,
                  }}
                />
                <img
                  src={lolGameDataImg(rp.perks[7].iconPath)}
                  alt={''}
                  style={{
                    width: iconSize.ternary,
                    height: iconSize.ternary,
                  }}
                />
                <img
                  src={lolGameDataImg(rp.perks[8].iconPath)}
                  alt={''}
                  style={{
                    width: iconSize.ternary,
                    height: iconSize.ternary,
                  }}
                />
              </Stack>
              <Stack direction={'row'} columnGap={2}>
                <img
                  src={spellIcon(rp.summonerSpellIds[0])}
                  alt={''}
                  style={{ width: iconSize.spell, height: iconSize.spell }}
                />
                <img
                  src={spellIcon(rp.summonerSpellIds[1])}
                  alt={''}
                  style={{ width: iconSize.spell, height: iconSize.spell }}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </CustomDialog>
  );
};
