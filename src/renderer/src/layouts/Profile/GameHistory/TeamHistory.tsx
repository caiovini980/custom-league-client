import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';
import { Divider, Stack, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SquareIcon } from '@render/components/SquareIcon';
import { GenericGameHistoryItem } from '@render/layouts/Profile/GameHistory/GenericGameHistoryItem';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';

interface TeamHistoryProps {
  teamIndex: number;
  game: LolMatchHistoryV1Games_Id;
}

export const TeamHistory = ({ teamIndex, game }: TeamHistoryProps) => {
  const { genericImg, championIcon } = useLeagueImage();
  const { rcpFeLolMatchHistory } = useLeagueTranslate();

  const [spriteImage, setSpriteImage] = useState<HTMLImageElement>();

  const teamId = teamIndex * 100;
  const rcpFeLolMatchHistoryTrans = rcpFeLolMatchHistory('trans');

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

  const getStatsImage = (index: number) => {
    if (!spriteImage) return '';
    const width = 80;
    const height = 80;
    const spacing = 0;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    const y = index * (height + spacing);

    if (!ctx) {
      return '';
    }

    ctx.drawImage(
      spriteImage, // imagem principal
      0,
      y, // origem da subimagem na imagem principal
      width,
      height, // tamanho da subimagem
      0,
      0, // destino no canvas
      width,
      height, // tamanho final no canvas
    );

    return canvas.toDataURL();
  };

  useEffect(() => {
    const url =
      'plugins/rcp-fe-lol-match-history/global/default/right_icons_grub.png';
    const img = new Image();
    img.src = genericImg(url);
    img.onload = () => {
      setSpriteImage(img);
    };
  }, []);

  return (
    <Stack direction={'column'} width={'100%'}>
      <Stack
        direction={'row'}
        columnGap={2}
        p={1}
        sx={{
          background: (t) =>
            alpha(
              team.win === 'Win'
                ? t.palette.matchHistory.win
                : t.palette.matchHistory.defeat,
              0.6,
            ),
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Typography>
          {rcpFeLolMatchHistoryTrans(
            `MATCH_HISTORY_MATCH_RESULT_TEAM_${teamIndex}_LABEL`,
          )}
        </Typography>
        <Divider orientation={'vertical'} flexItem />
        <Stack direction={'row'} columnGap={0.2} alignItems={'center'}>
          {teamData.bans.map((b) => (
            <SquareIcon
              key={b.championId}
              src={championIcon(b.championId)}
              size={24}
            />
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
        <IconValue src={getStatsImage(0)} value={teamData.towers} />
        <IconValue src={getStatsImage(1)} value={teamData.inhibitor} />
        <IconValue src={getStatsImage(2)} value={teamData.barons} />
        <IconValue src={getStatsImage(3)} value={teamData.dragons} />
        <IconValue src={getStatsImage(4)} value={teamData.herald} />
        <IconValue src={getStatsImage(6)} value={teamData.horde} />
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

const IconValue = (props: { src: string; value: string | number }) => {
  const iconSize = 22;
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'center'}
      columnGap={0.5}
    >
      <img src={props.src} alt={''} height={iconSize} width={iconSize} />
      <Typography>{props.value}</Typography>
    </Stack>
  );
};
