import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SquareIcon } from '@render/components/SquareIcon';
import { useState } from 'react';
import { LolChampSelectV1AllGridCampions } from '@shared/typings/lol/response/lolChampSelectV1AllGridChampions';
import { LolChampSelectV1PickableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1PickableChampionIds';
import { LolChampSelectV1BannableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1BannableChampionIds';
import { LolChampSelectV1DisabledChampionIds } from '@shared/typings/lol/response/lolChampSelectV1DisabledChampionIds';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { FaTimes } from 'react-icons/fa';

export const ChampionSelectList = () => {
  const { genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const {
    currentAction,
    currentPlayer,
    disabledChampionList,
    pickPlayerActionId,
    banPlayerActionId,
  } = useChampSelectContext();

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

  const { championId } = currentPlayer;

  const position = ['top', 'jungle', 'middle', 'bottom', 'utility'];

  const filterByPosition = (roles: string[], position: string) => {
    if (!position) return true;
    const rolesEx = [
      'mage',
      'support',
      'fighter',
      'tank',
      'marksman',
      'assassin',
    ];
    const rolesPosition: Record<string, string[]> = {
      top: ['fighter', 'tank'],
      jungle: ['tank', 'fighter'],
      middle: ['mage', 'assassin'],
      bottom: ['marksman'],
      utility: ['support'],
    };
    return (rolesPosition[position] ?? rolesEx).some((r) => roles.includes(r));
  };

  const getChampionFiltered = () => {
    const filtered = champions.filter((c) => {
      const matches: boolean[] = [
        !disabledChampion.includes(c.id),
        filterByPosition(c.roles, positionFilter),
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

    if (currentAction === 'pick') {
      return filtered.filter((c) => pickableChampion.includes(c.id) && c.owned);
    }

    return filtered;
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
    const active: boolean[] = [disabledChampionList.includes(championId)];
    return active.some(Boolean);
  };

  return (
    <Stack
      direction={'column'}
      overflow={'auto'}
      height={'100%'}
      display={championId > 0 ? 'none' : 'flex'}
      p={1}
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
                  p === positionFilter ? t.palette.action.selected : '',
              }}
            >
              <img src={positionIcon(p)} alt={p} height={'20px'} />
            </CustomIconButton>
          );
        })}
        <CustomTextField
          size={'small'}
          placeholder={'Champion name'}
          value={championNameFilter}
          onChangeText={setChampionNameFilter}
          endIcon={
            <CustomIconButton onClick={() => setChampionNameFilter('')}>
              <FaTimes size={12} />
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
                justifyContent={'space-between'}
                width={50}
                disabled={disabled(c.id)}
                onClick={() => onClickChampion(c)}
              >
                <SquareIcon
                  src={championIcon(c.id)}
                  size={50}
                  grayScale={disabledChampionList.includes(c.id)}
                />
                <Typography fontSize={'0.7rem'}>{c.name}</Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
