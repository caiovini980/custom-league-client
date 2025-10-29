import {
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GenericIconTooltip } from '@render/components/League/GenericIconTooltip';
import { GenericIconValue } from '@render/components/League/GenericIconValue';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChampionStatus } from '@render/layouts/Lobby/EndOfGame/ChampionStatus';
import { currencyFormat } from '@render/utils/stringUtil';
import { LolEndOfGameV1EogStatsBlockTeam } from '@shared/typings/lol/response/lolEndOfGameV1EogStatsBlock';

interface TeamStatusProps {
  gameLength: number;
  team: LolEndOfGameV1EogStatsBlockTeam;
}

export const TeamStatus = ({ team, gameLength }: TeamStatusProps) => {
  const { rcpFeLolPostgame, rcpFeLolMatchHistory } = useLeagueTranslate();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;
  const { rcpFeLolMatchHistoryTrans } = rcpFeLolMatchHistory;

  const iconSize = 18;
  const goldIconSrc =
    'plugins/rcp-fe-lol-postgame/global/default/scoreboard-coins-icon.svg';
  const kdaIconSrc =
    'plugins/rcp-fe-lol-postgame/global/default/scoreboard-kda-icon.svg';
  const minionIconSrc =
    'plugins/rcp-fe-lol-postgame/global/default/scoreboard-stat-switcher-minions-slain.svg';
  const wardIconSrc =
    'plugins/rcp-fe-lol-static-assets/global/default/npe-rewards-ward.png';
  const damageIconSrc =
    'plugins/rcp-fe-lol-postgame/global/default/scoreboard-sword-icon.svg';

  const { CHAMPIONS_KILLED, NUM_DEATHS, ASSISTS, GOLD_EARNED } = team.stats;

  const isWin = !!team.stats.WIN;

  return (
    <Stack
      direction={'column'}
      width={'100%'}
      my={1}
      justifyContent={'center'}
      sx={{
        background: (t) =>
          alpha(
            isWin ? t.palette.matchHistory.win : t.palette.matchHistory.defeat,
            0.4,
          ),
      }}
    >
      <Table
        sx={{
          width: 'fit-content',
          '& tr td': {
            height: 50,
            p: 0,
          },
          '& th': {
            height: 40,
            p: 0.5,
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell width={120} colSpan={3}>
              <Stack
                direction={'row'}
                columnGap={2}
                divider={
                  <Divider
                    orientation={'vertical'}
                    variant={'middle'}
                    flexItem
                  />
                }
              >
                <Stack direction={'column'}>
                  <Typography>
                    {rcpFeLolPostgameTrans(
                      'postgame_scoreboard_header_team_label',
                      team.teamId / 100,
                    )}
                  </Typography>
                  <Typography fontSize={'0.6rem'}>
                    {rcpFeLolMatchHistoryTrans(
                      isWin
                        ? 'MATCH_HISTORY_MATCH_RESULT_VICTORY'
                        : 'MATCH_HISTORY_MATCH_RESULT_DEFEAT',
                    )}
                  </Typography>
                </Stack>
                <GenericIconValue
                  src={kdaIconSrc}
                  size={iconSize}
                  value={rcpFeLolPostgameTrans(
                    'postgame_scoreboard_row_kda_full',
                    CHAMPIONS_KILLED,
                    NUM_DEATHS,
                    ASSISTS,
                  )}
                />
                <GenericIconValue
                  src={goldIconSrc}
                  size={iconSize}
                  value={currencyFormat(GOLD_EARNED, 0)}
                />
              </Stack>
            </TableCell>
            <TableCell colSpan={2}>Items</TableCell>
            <TableCell align={'center'}>
              <GenericIconTooltip
                src={kdaIconSrc}
                value={rcpFeLolMatchHistoryTrans(
                  'MATCH_HISTORY_SCOREBOARD_KDA_ICON',
                )}
                size={iconSize}
              />
            </TableCell>
            <TableCell align={'center'}>
              <GenericIconTooltip
                src={damageIconSrc}
                value={rcpFeLolMatchHistoryTrans(
                  'MATCH_HISTORY_STATS_TAB_COMBAT',
                )}
                size={iconSize}
              />
            </TableCell>
            <TableCell align={'center'}>
              <GenericIconTooltip
                src={goldIconSrc}
                value={rcpFeLolMatchHistoryTrans(
                  'MATCH_HISTORY_GRAPH_ATTR_GOLD_EARNED',
                )}
                size={iconSize}
              />
            </TableCell>
            <TableCell align={'center'}>
              <GenericIconTooltip
                src={minionIconSrc}
                value={rcpFeLolMatchHistoryTrans(
                  'MATCH_HISTORY_GRAPH_ATTR_KILLED_MINION',
                )}
                size={iconSize}
              />
            </TableCell>
            <TableCell align={'center'}>
              <GenericIconTooltip
                src={wardIconSrc}
                value={rcpFeLolMatchHistoryTrans(
                  'MATCH_HISTORY_GRAPH_ATTR_WARDS_VISION_SCORE',
                )}
                size={iconSize}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {team.players.map((player) => (
            <ChampionStatus
              key={player.summonerId}
              championStatus={player}
              gameLength={gameLength}
            />
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
