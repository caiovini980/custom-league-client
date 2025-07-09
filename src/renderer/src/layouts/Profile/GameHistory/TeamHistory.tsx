import { Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSpriteImage } from '@render/hooks/useSpriteImage';
import { GenericGameHistoryItem } from '@render/layouts/Profile/GameHistory/GenericGameHistoryItem';
import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';
import { IconValue } from './IconValue';

interface TeamHistoryProps {
  teamIndex: number;
  game: LolMatchHistoryV1Games_Id;
}

export const TeamHistory = ({ teamIndex, game }: TeamHistoryProps) => {
  const { genericImg, championIcon } = useLeagueImage();
  const { rcpFeLolMatchHistory } = useLeagueTranslate();
  const { getSprite } = useSpriteImage({
    src: 'plugins/rcp-fe-lol-match-history/global/default/right_icons_grub.png',
    width: 80,
    height: 80,
  });

  const teamId = teamIndex * 100;
  const { rcpFeLolMatchHistoryTrans } = rcpFeLolMatchHistory;

  const team = game.teams.find((t) => t.teamId === teamId);
  if (!team) {
    throw new Error('Team not found');
  }

  const teamParticipants = game.participants.filter((p) => p.teamId === teamId);

  const teamData = (() => {
    return teamParticipants.reduce(
      (prev, curr) => {
        return Object.assign(prev, {
          deaths: prev.deaths + curr.stats.deaths,
          kills: prev.kills + curr.stats.kills,
          assists: prev.assists + curr.stats.assists,
        });
      },
      {
        deaths: 0,
        kills: 0,
        assists: 0,
        towers: team.towerKills,
        inhibitor: team.inhibitorKills,
        dragons: team.dragonKills,
        barons: team.baronKills,
        herald: team.riftHeraldKills,
        horde: team.hordeKills,
        bans: team.bans,
      },
    );
  })();

  const isWin = team.win === 'Win';

  return (
    <Stack direction={'column'} width={'100%'}>
      <Stack
        direction={'row'}
        columnGap={2}
        p={1}
        sx={{
          background: (t) =>
            alpha(
              isWin
                ? t.palette.matchHistory.win
                : t.palette.matchHistory.defeat,
              0.6,
            ),
          borderBottom: '1px solid var(--mui-palette-divider)',
        }}
      >
        <Typography>
          {rcpFeLolMatchHistoryTrans(
            isWin
              ? 'MATCH_HISTORY_MATCH_RESULT_VICTORY'
              : 'MATCH_HISTORY_MATCH_RESULT_DEFEAT',
          )}
        </Typography>
        <Typography>
          {rcpFeLolMatchHistoryTrans(
            `MATCH_HISTORY_MATCH_RESULT_TEAM_${teamIndex}_LABEL`,
          )}
        </Typography>
        <Divider orientation={'vertical'} flexItem />
        <Stack direction={'row'} columnGap={0.2} alignItems={'center'}>
          {teamData.bans.map((b, i) => (
            <SquareIcon key={i} src={championIcon(b.championId)} size={24} />
          ))}
        </Stack>
        <Divider orientation={'vertical'} flexItem />
        <IconValue
          src={genericImg(
            'plugins/rcp-fe-lol-match-history/global/default/kills.png',
          )}
          value={`${teamData.kills} / ${teamData.deaths} / ${teamData.assists}`}
        />
        <Divider orientation={'vertical'} flexItem />
        <IconValue src={getSprite(0)} value={teamData.towers} />
        <IconValue src={getSprite(1)} value={teamData.inhibitor} />
        <IconValue src={getSprite(2)} value={teamData.barons} />
        <IconValue src={getSprite(3)} value={teamData.dragons} />
        <IconValue src={getSprite(4)} value={teamData.herald} />
        <IconValue src={getSprite(6)} value={teamData.horde} />
      </Stack>
      {teamParticipants.map((p) => {
        return (
          <GenericGameHistoryItem
            key={p.participantId}
            game={game}
            participantId={p.participantId}
            isOtherPlayer
          />
        );
      })}
    </Stack>
  );
};
