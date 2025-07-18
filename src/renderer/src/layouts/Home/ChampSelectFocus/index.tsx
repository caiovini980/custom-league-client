import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { withChampSelectSession } from '@render/hoc/withChampSelectSession';
import { useChampSelect } from '@render/hooks/useChampSelect';
import { useChampSelectTimer } from '@render/hooks/useChampSelectTimer';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChampSelectAudio } from '@render/layouts/Home/ChampSelectFocus/ChampSelectAudio';
import { electronHandle } from '@render/utils/electronFunction.util';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionAction,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ChampSelectFocus = withChampSelectSession(({ session }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rcpFeLolChampSelect, rcpFeLolSocial } = useLeagueTranslate();
  const { summonerData, summonersData, getCurrentActionIndex, getAction } =
    useChampSelect(session);
  const { time, title } = useChampSelectTimer(session, getAction());

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;
  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  useEffect(() => {
    if (summonerData?.isActingNow) {
      electronHandle.client.priorityApp();
      navigate('/lobby');
    }
  }, [summonerData]);

  useEffect(() => {
    navigate('/lobby');
  }, [session.id]);

  const currentActionIndex = getCurrentActionIndex();

  const getPickingChampion = () => {
    if (currentActionIndex === -1) return [];

    return session.actions[currentActionIndex];
  };

  const getPickingChampionNext = () => {
    if (currentActionIndex === -1) return [];

    const actions = session.actions[currentActionIndex + 1];
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
          return <Player key={a.actorCellId} action={a} session={session} />;
        })}
        <Typography fontSize={'0.8rem'}>
          {rcpFeLolChampSelectTrans('picking_champion_next')}
        </Typography>
        {getPickingChampionNext().map((a) => {
          return <Player key={a.actorCellId} action={a} session={session} />;
        })}
      </Stack>
      <ChampSelectAudio
        session={session}
        time={time}
        action={getAction()}
        summonerData={summonerData}
        summonersData={summonersData}
      />
    </>
  );
});

const Player = (props: {
  session: LolChampSelectV1Session;
  action: LolChampSelectV1SessionAction;
}) => {
  const { championIcon } = useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const getName = () => {
    const { session, action } = props;
    const isEnemy = !action.isAllyAction;
    const cellId = action.actorCellId;

    if (isEnemy) {
      const amount = session.theirTeam.length;
      const index = cellId >= amount ? cellId - amount : cellId;
      return rcpFeLolChampSelectTrans('name_visibility_type_enemy', index + 1);
    }
    return (
      [...session.myTeam, ...session.theirTeam].find(
        (team) => team.cellId === cellId,
      )?.gameName ?? ''
    );
  };

  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <CircularIcon src={championIcon(props.action.championId)} />
      <Typography>{getName()}</Typography>
    </Stack>
  );
};
