import {
  Box,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ItemIconDescription } from '@render/components/League/ItemIconDescription';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { SummonerIcon } from '@render/layouts/Lobby/EndOfGame/SummonerIcon';
import { LolEndOfGameV1EogStatsBlockPlayer } from '@shared/typings/lol/response/lolEndOfGameV1EogStatsBlock';
import { formatCurrency } from '@shared/utils/string.util';
import { PropsWithChildren } from 'react';

interface ChampionStatusProps {
  gameLength: number;
  championStatus: LolEndOfGameV1EogStatsBlockPlayer;
}

export const ChampionStatus = ({
  championStatus,
  gameLength,
}: ChampionStatusProps) => {
  const { lolGameDataImg, spellIcon } = useLeagueImage();
  const { rcpFeLolPostgame, rcpFeLolMatchHistory } = useLeagueTranslate();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;
  const { rcpFeLolMatchHistoryTrans } = rcpFeLolMatchHistory;

  const {
    CHAMPIONS_KILLED,
    NUM_DEATHS,
    ASSISTS,
    MINIONS_KILLED,
    NEUTRAL_MINIONS_KILLED,
  } = championStatus.stats;
  const kdaRate = (CHAMPIONS_KILLED + ASSISTS) / NUM_DEATHS;
  const kdaText = Number.isFinite(kdaRate) ? kdaRate.toFixed(2) : 'Perfect';
  const cs = MINIONS_KILLED + NEUTRAL_MINIONS_KILLED;
  const gameLeftInMinute = Number((gameLength / 60).toFixed(0));
  const selectedPosition = rcpFeLolPostgameTrans(
    `postgame_scoreboard_lane_position_name_${championStatus.selectedPosition.toLowerCase()}`,
  );

  return (
    <TableRow>
      <TableCell width={130}>
        <Box
          sx={{
            width: '100%',
            height: 'inherit',
            position: 'relative',
            zIndex: 2,
            '&::before': {
              content: "''",
              zIndex: -1,
              inset: 0,
              position: 'absolute',
              background: `url(${lolGameDataImg(championStatus.skinTilePath)})`,
              backgroundSize: 'auto 125px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0px -15px',
              filter: 'blur(0px)',
              maskImage:
                'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80%)',
            },
          }}
        />
      </TableCell>
      <TableCell width={30}>
        <Box display={'flex'} position={'relative'} mr={1}>
          <SummonerIcon
            profileIconId={championStatus.profileIconId}
            summonerId={championStatus.summonerId}
            puuid={championStatus.puuid}
            gameId={championStatus.gameId}
          />
          <Typography
            sx={{
              position: 'absolute',
              bottom: -5,
              right: -2,
              fontSize: '0.6rem !important',
              borderRadius: '50%',
              p: '2px',
              textAlign: 'center',
              width: 18,
              height: 18,
              color: 'var(--mui-palette-textPrimary)',
              background: 'var(--mui-palette-background-paper)',
              pointerEvents: 'none',
            }}
          >
            {championStatus.stats.LEVEL}
          </Typography>
        </Box>
      </TableCell>
      <TableCell width={200}>
        <Stack direction={'column'}>
          <Typography>{championStatus.riotIdGameName}</Typography>
          <Typography fontSize={'0.8rem'} color={'textSecondary'}>
            {championStatus.championName}
            {selectedPosition && `(${selectedPosition})`}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell width={35}>
        <Stack
          direction={'column'}
          justifyContent={'space-around'}
          height={'100%'}
        >
          <SquareIcon src={spellIcon(championStatus.spell1Id)} size={20} />
          <SquareIcon src={spellIcon(championStatus.spell2Id)} size={20} />
        </Stack>
      </TableCell>
      <TableCell width={300}>
        <Stack direction={'row'}>
          {championStatus.items.map((item, i) => {
            return <ItemIconDescription key={i} itemId={item} iconSize={40} />;
          })}
        </Stack>
      </TableCell>
      <TableCell align={'center'} width={80}>
        <Stack direction={'column'}>
          <Typography>
            {rcpFeLolPostgameTrans(
              'postgame_scoreboard_row_kda_full',
              CHAMPIONS_KILLED,
              NUM_DEATHS,
              ASSISTS,
            )}
          </Typography>
          <Typography fontSize={'0.7rem'} color={'textSecondary'}>
            {kdaText}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align={'center'} width={80}>
        <TooltipMoreInfo
          info={[
            {
              label: rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_GRAPH_ATTR_DMG_CHAMPION_TOTAL',
              ),
              value: formatCurrency(
                championStatus.stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS,
                0,
              ),
            },
            {
              label: rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_GRAPH_ATTR_DMG_TAKEN_TOTAL',
              ),
              value: formatCurrency(championStatus.stats.TOTAL_DAMAGE_TAKEN, 0),
            },
          ]}
        >
          <Stack direction={'column'}>
            <Typography>
              {formatCurrency(
                championStatus.stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS,
                0,
              )}
            </Typography>
            <Typography fontSize={'0.7rem'} color={'textSecondary'}>
              {formatCurrency(championStatus.stats.TOTAL_DAMAGE_TAKEN, 0)}
            </Typography>
          </Stack>
        </TooltipMoreInfo>
      </TableCell>
      <TableCell align={'center'} width={80}>
        <Stack direction={'column'}>
          <Typography>
            {formatCurrency(championStatus.stats.GOLD_EARNED, 0)}
          </Typography>
          <Typography fontSize={'0.7rem'} color={'textSecondary'}>
            {rcpFeLolPostgameTrans(
              'postgame_scoreboard_stat_display_stat_per_minute',
              (championStatus.stats.GOLD_EARNED / gameLeftInMinute).toFixed(2),
            )}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align={'center'} width={80}>
        <Stack direction={'column'}>
          <Typography>{formatCurrency(cs, 0)}</Typography>
          <Typography fontSize={'0.7rem'} color={'textSecondary'}>
            {rcpFeLolPostgameTrans(
              'postgame_scoreboard_stat_display_stat_per_minute',
              (cs / gameLeftInMinute).toFixed(2),
            )}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align={'center'} width={80}>
        <TooltipMoreInfo
          info={[
            {
              label: rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_GRAPH_ATTR_WARDS_PURCHASED_VISION',
              ),
              value: championStatus.stats.VISION_WARDS_BOUGHT_IN_GAME,
            },
            {
              label: rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_GRAPH_ATTR_WARDS_PLACED',
              ),
              value: championStatus.stats.WARD_PLACED,
            },
            {
              label: rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_GRAPH_ATTR_WARDS_DESTROYED',
              ),
              value: championStatus.stats.WARD_KILLED,
            },
          ]}
        >
          <Stack
            direction={'column'}
            sx={{
              '& > p': {
                fontSize: '0.8rem',
              },
            }}
          >
            <Typography>
              {championStatus.stats.VISION_WARDS_BOUGHT_IN_GAME}
            </Typography>
            <Typography>
              {championStatus.stats.WARD_PLACED} /{' '}
              {championStatus.stats.WARD_KILLED}
            </Typography>
          </Stack>
        </TooltipMoreInfo>
      </TableCell>
    </TableRow>
  );
};

const TooltipMoreInfo = (
  props: PropsWithChildren<{
    info: { label: string; value: string | number }[];
  }>,
) => {
  return (
    <Tooltip
      title={
        <Stack
          direction={'column'}
          sx={{
            '& > p': {
              fontSize: '0.75rem',
            },
          }}
        >
          {props.info.map((i, index) => {
            return (
              <Typography key={index}>
                {i.label}: {i.value}
              </Typography>
            );
          })}
        </Stack>
      }
      disableInteractive
      arrow
    >
      <span>{props.children}</span>
    </Tooltip>
  );
};
