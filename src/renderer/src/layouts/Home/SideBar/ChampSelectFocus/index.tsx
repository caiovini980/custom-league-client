import {Stack, Typography} from '@mui/material';
import {CircularIcon} from '@render/components/CircularIcon';
import {withChampSelectSession} from '@render/hoc/withChampSelectSession';
import {useChampSelectTimer} from '@render/hooks/useChampSelectTimer';
import {useLeagueImage} from '@render/hooks/useLeagueImage';
import {useLeagueTranslate} from '@render/hooks/useLeagueTranslate';
import {ChampSelectAudio} from '@render/layouts/Home/SideBar/ChampSelectFocus/ChampSelectAudio';
import {OngoingSwapMemo} from '@render/layouts/Home/SideBar/ChampSelectFocus/OngoingSwap';
import {electronHandle} from '@render/utils/electronFunction.util';
import {champSelectStore} from '@render/zustand/stores/champSelectStore';
import {LolChampSelectV1SessionAction} from '@shared/typings/lol/response/lolChampSelectV1Session';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router';

export const ChampSelectFocus = withChampSelectSession(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const {rcpFeLolChampSelect, rcpFeLolSocial} = useLeagueTranslate();

  const isActingNow = champSelectStore.getCurrentSummonerData(
    (s) => s.isActingNow,
    false,
  );
  const currentActionIndex = champSelectStore.currentActionIndex.use();
  const currentAction = champSelectStore.currentAction.use();
  const actionsGroup = champSelectStore.sessionActions.use();

  const {time, title} = useChampSelectTimer();

  const {rcpFeLolChampSelectTrans} = rcpFeLolChampSelect;
  const {rcpFeLolSocialTrans} = rcpFeLolSocial;

  useEffect(() => {
    if (isActingNow) {
      electronHandle.client.priorityApp();
      navigate('/lobby');
    }
  }, [isActingNow]);

  useEffect(() => {
    navigate('/lobby');
  }, []);

  const getPickingChampion = () => {
    if (currentActionIndex === -1) return [];
    return actionsGroup[currentActionIndex];
  };

  const getPickingChampionNext = () => {
    if (currentActionIndex === -1) return [];

    const actions = actionsGroup[currentActionIndex + 1];
    if (!actions) return [];

    return actions;
  };

  return (
    <>
      <Stack
        direction={'column'}
        rowGap={1}
        sx={{
          display: location.pathname.slice(1) === 'lobby' ? 'none' : 'flex',
          borderTop: '1px solid var(--mui-palette-divider)',
          p: 1,
        }}
      >
        <Typography fontSize={'0.8rem'}>
          {rcpFeLolSocialTrans('availability_championSelect')}
        </Typography>
        <Typography fontSize={'0.8rem'}>
          {title} {time}
        </Typography>
        <Typography fontSize={'0.8rem'}>
          {rcpFeLolChampSelectTrans('picking_champion')}
        </Typography>
        {getPickingChampion().map((a) => {
          return <Player key={a.actorCellId} action={a}/>;
        })}
        <Typography fontSize={'0.8rem'}>
          {rcpFeLolChampSelectTrans('picking_champion_next')}
        </Typography>
        {getPickingChampionNext().map((a) => {
          return <Player key={a.actorCellId} action={a}/>;
        })}
      </Stack>
      <ChampSelectAudio
        time={time}
        action={currentAction}
        isActingNow={isActingNow}
      />
      <OngoingSwapMemo/>
    </>
  );
});

const Player = (props: { action: LolChampSelectV1SessionAction }) => {
  const {championIcon} = useLeagueImage();
  const {rcpFeLolChampSelect} = useLeagueTranslate();

  const {rcpFeLolChampSelectTrans} = rcpFeLolChampSelect;

  const name = champSelectStore.getSessionData((session) => {
    const {action} = props;
    const isEnemy = !action.isAllyAction;
    const cellId = action.actorCellId;

    if (isEnemy) {
      const amount = session.theirTeam.length;
      const index = cellId >= amount ? cellId - amount : cellId;
      return rcpFeLolChampSelectTrans('name_visibility_type_enemy', index + 1);
    }

    return (
      session.myTeam.find((team) => team.cellId === cellId)?.gameName ?? ''
    );
  });

  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <CircularIcon src={championIcon(props.action.championId)}/>
      <Typography>{name}</Typography>
    </Stack>
  );
};
