import { ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ChampSelectionActions,
  champSelectStore,
} from '@render/zustand/stores/champSelectStore';
import { LolChampSelectV1AllGridCampions } from '@shared/typings/lol/response/lolChampSelectV1AllGridChampions';
import { LolChampSelectV1BannableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1BannableChampionIds';
import { LolChampSelectV1DisabledChampionIds } from '@shared/typings/lol/response/lolChampSelectV1DisabledChampionIds';
import { LolChampSelectV1PickableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1PickableChampionIds';
import { LolPerksV1RecommendedChampionPositions } from '@shared/typings/lol/response/lolPerksV1RecommendedChampionPositions';
import { isEqual } from 'lodash-es';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

export const ChampionSelectList = () => {
  const { genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const championPickedIdList = champSelectStore.getSessionData(
    (session) =>
      [...session.myTeam, ...session.theirTeam].map((t) => t.championId),
    isEqual,
  );
  const currentAction = champSelectStore.currentAction.use();
  const pickPlayerActionId = champSelectStore.currentPickActionId.use();
  const banPlayerActionId = champSelectStore.currentBanActionId.use();
  const disabledChampionList = champSelectStore.disabledChampions.use();

  const [championNameFilter, setChampionNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [champions, setChampions] = useState<LolChampSelectV1AllGridCampions[]>(
    [],
  );
  const [disabledChampion, setDisabledChampion] =
    useState<LolChampSelectV1DisabledChampionIds>([]);
  const [pickableChampion, setPickableChampion] =
    useState<LolChampSelectV1PickableChampionIds>([]);
  const [bannableChampion, setBannableChampion] =
    useState<LolChampSelectV1BannableChampionIds>([]);
  const [recommendedChampionPosition, setRecommendedChampionPosition] =
    useState<LolPerksV1RecommendedChampionPositions>({});
  const { championIcon } = useLeagueImage();

  useLeagueClientEvent('/lol-champ-select/v1/all-grid-champions', (data) => {
    setChampions(data);
  });
  useLeagueClientEvent('/lol-champ-select/v1/bannable-champion-ids', (data) => {
    setBannableChampion(data);
  });
  useLeagueClientEvent('/lol-champ-select/v1/disabled-champion-ids', (data) => {
    setDisabledChampion(data);
  });
  useLeagueClientEvent('/lol-champ-select/v1/pickable-champion-ids', (data) => {
    setPickableChampion(data);
  });
  useLeagueClientEvent(
    '/lol-perks/v1/recommended-champion-positions',
    (data) => {
      setRecommendedChampionPosition(data);
    },
  );

  const iconChampionSize = 60;
  const position = ['top', 'jungle', 'middle', 'bottom', 'utility'];

  const filterByPosition = (championId: number, position: string) => {
    if (!position) return true;
    const championPosition = recommendedChampionPosition[championId];
    if (!championPosition) return true;
    return championPosition.recommendedPositions
      .map((p) => p.toLowerCase())
      .includes(position);
  };

  const isChampionPicked = (championId: number) => {
    return championPickedIdList.includes(championId);
  };

  const getChampionFiltered = () => {
    const filtered = champions.filter((c) => {
      const matches: boolean[] = [
        !disabledChampion.includes(c.id),
        filterByPosition(c.id, positionFilter),
        c.name.toLowerCase().includes(championNameFilter.toLowerCase()),
      ];
      return matches.every(Boolean);
    });

    if (currentAction === 'planning') {
      return filtered;
    }

    if (currentAction === 'ban') {
      return filtered.filter((c) => bannableChampion.includes(c.id));
    }

    return filtered.filter((c) => pickableChampion.includes(c.id) && c.owned);
  };

  const positionIcon = (position: string) => {
    return genericImg(
      `plugins/rcp-fe-lol-champ-select/global/default/svg/position-${position}.svg`,
    );
  };

  const onChangePositionFilter = (position: string) => {
    setPositionFilter(position === positionFilter ? '' : position);
  };

  const onClickChampion = (champion: LolChampSelectV1AllGridCampions) => {
    const actionId =
      currentAction === 'ban' ? banPlayerActionId : pickPlayerActionId;
    makeRequest(
      'PATCH',
      buildEventUrl('/lol-champ-select/v1/session/actions/{digits}', actionId),
      {
        championId: champion.id,
      },
    ).then();
  };

  const disabled = (championId: number) => {
    const active: boolean[] = [
      disabledChampionList.includes(championId),
      isChampionPicked(championId),
    ];
    return active.some(Boolean);
  };

  const hiddenList = () => {
    const hiddenAction: ChampSelectionActions[] = ['finalization', 'pick-done'];
    return hiddenAction.includes(currentAction);
  };

  return (
    <Stack
      direction={'column'}
      overflow={'auto'}
      height={'100%'}
      display={hiddenList() ? 'none' : 'flex'}
      px={1}
      sx={{
        background: 'rgba(0,0,0,0.5)',
      }}
      rowGap={2}
    >
      <Stack
        direction={'row'}
        columnGap={1}
        justifyContent={'center'}
        alignItems={'center'}
        p={1}
      >
        {position.map((p) => {
          return (
            <CustomIconButton
              key={p}
              onClick={() => onChangePositionFilter(p)}
              sx={{
                background: (t) =>
                  p === positionFilter ? t.palette.grey['800'] : '',
              }}
            >
              <img src={positionIcon(p)} alt={p} height={'20px'} />
            </CustomIconButton>
          );
        })}
        <CustomTextField
          size={'small'}
          placeholder={rcpFeLolChampSelectTrans('search')}
          value={championNameFilter}
          onChangeText={setChampionNameFilter}
          endIcon={
            <CustomIconButton onClick={() => setChampionNameFilter('')}>
              <MdClose size={12} />
            </CustomIconButton>
          }
        />
      </Stack>
      <Grid container spacing={2} overflow={'auto'} width={'100%'}>
        {getChampionFiltered().map((c) => {
          return (
            <Grid key={c.id}>
              <Stack
                direction={'column'}
                rowGap={1}
                component={ButtonBase}
                alignItems={'center'}
                justifyContent={'center'}
                width={iconChampionSize}
                disabled={disabled(c.id)}
                onClick={() => onClickChampion(c)}
              >
                <SquareIcon
                  src={championIcon(c.id)}
                  size={iconChampionSize}
                  grayScale={disabled(c.id)}
                />
                <Typography fontSize={'0.75rem'}>{c.name}</Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
