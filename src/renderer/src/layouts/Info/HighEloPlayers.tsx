import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  CustomIconButton,
  CustomSelect,
  CustomSelectProps,
} from '@render/components/input';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { sortBy } from 'lodash';
import { formatCurrency } from '@shared/utils/string.util';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { FaArrowsRotate, FaEye } from 'react-icons/fa6';

interface PlayerData {
  puuid: string;
  summonerId: number;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  position: number;
  wins: number;
  losses: number;
  leaguePoints: number;
}

export const HighEloPlayers = () => {
  const { profileIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolLeagues, rcpFeLolSharedComponents, rcpFeLolSocial } =
    useLeagueTranslate();

  const profileModalRef = useRef<ProfileModalRef>(null);

  const [loading, setLoading] = useState(true);
  const [challengersPlayerInGame, setChallengersPlayerInGame] = useState<
    PlayerData[]
  >([]);
  const [tierQueueSelected, setTierQueueSelected] = useState(
    'CHALLENGER::RANKED_SOLO_5x5',
  );

  const rcpFeLolLeaguesTrans = rcpFeLolLeagues('trans');
  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');
  const rcpFeLolSharedComponentsTransLeagueTierNames = rcpFeLolSharedComponents(
    'trans-league-tier-names',
  );

  const findPlayersInGame = async () => {
    const [tier, queue] = tierQueueSelected.split('::');
    const error = () => {
      setLoading(false);
    };

    setLoading(true);
    const playersInLeagueRes = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-ranked/v1/apex-leagues/{string}/{string}',
        queue,
        tier,
      ),
      undefined,
    );

    if (!playersInLeagueRes.ok) {
      error();
      return;
    }

    const playersInLeague = playersInLeagueRes.body;

    const puuids = playersInLeague.divisions[0].standings.map((p) => p.puuid);

    const playersInGameRes = await makeRequest(
      'POST',
      '/lol-spectator/v3/buddy/spectate',
      puuids,
    );

    if (!playersInGameRes.ok) {
      error();
      return;
    }

    const playersInGame = playersInLeague.divisions[0].standings.filter((p) =>
      playersInGameRes.body.availableForWatching.includes(p.puuid),
    );
    const playersSummonerId = playersInGame.map((p) => p.summonerId);

    const playersDataRes = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v2/summoners?ids={digits}',
        JSON.stringify(playersSummonerId),
      ),
      undefined,
    );

    if (!playersDataRes.ok) {
      error();
      return;
    }

    const data: PlayerData[] = playersDataRes.body.map((player) => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const leagueData = playersInGame.find((p) => p.puuid === player.puuid)!;

      return {
        puuid: player.puuid,
        summonerId: player.summonerId,
        gameName: player.gameName,
        tagLine: player.tagLine,
        profileIconId: player.profileIconId,
        position: leagueData.position,
        wins: leagueData.wins,
        losses: leagueData.losses,
        leaguePoints: leagueData.leaguePoints,
      };
    });

    setChallengersPlayerInGame([...sortBy(data, (d) => d.position)]);
    setLoading(false);
  };

  const options = (): CustomSelectProps<string>['options'] => {
    const tiers = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];
    const queuesType = ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'];

    return tiers.flatMap((tier) =>
      queuesType.map((queue) => {
        const tierName = rcpFeLolSharedComponentsTransLeagueTierNames(
          `lol_league_tier_names_${tier.toLowerCase()}`,
        );
        const queueName = rcpFeLolSharedComponentsTransLeagueTierNames(
          `lol_league_queue_name_${queue.toLowerCase()}`,
        );
        return {
          label: `${tierName} (${queueName})`,
          value: `${tier}::${queue}`,
        };
      }),
    );
  };

  const startSpectate = (puuid: string) => {
    makeRequest('POST', '/lol-spectator/v1/spectate/launch', {
      puuid,
    });
  };

  useEffect(() => {
    findPlayersInGame();
  }, [tierQueueSelected]);

  return (
    <Stack
      direction={'column'}
      height={'100%'}
      overflow={'auto'}
      divider={<Divider />}
      position={'relative'}
    >
      <LoadingScreen loading={loading} fullArea backdrop />
      <Stack direction={'row'} p={1} alignItems={'center'} columnGap={2}>
        <CustomSelect
          label={`${rcpFeLolLeaguesTrans('LEAGUES_DROPDOWN_APEX', '')} (${rcpFeLolSocialTrans('availability_inGame')})`}
          options={options()}
          value={tierQueueSelected}
          onChangeValue={setTierQueueSelected}
        />
        <CustomIconButton onClick={() => findPlayersInGame()}>
          <FaArrowsRotate size={18} />
        </CustomIconButton>
      </Stack>
      <Box display={'flex'} overflow={'auto'}>
        <Table>
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              background: 'var(--mui-palette-background-default)',
              zIndex: 2,
            }}
          >
            <TableCell>
              <Typography width={50}>#</Typography>
            </TableCell>
            <TableCell>
              <Typography>
                {rcpFeLolLeaguesTrans('LEAGUES_PROFILE_TABLE_HEADER_PLAYERS')}
              </Typography>
            </TableCell>
            <TableCell align={'center'}>
              <Typography>
                {rcpFeLolLeaguesTrans('LEAGUES_PROFILE_TABLE_HEADER_WIN_LOSE')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                {rcpFeLolLeaguesTrans('LEAGUES_PROFILE_TABLE_HEADER_POINTS')}
              </Typography>
            </TableCell>
            <TableCell />
          </TableHead>
          <TableBody>
            {challengersPlayerInGame.map((player) => {
              return (
                <TableRow key={player.puuid}>
                  <TableCell>
                    <Typography>{player.position}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      columnGap={1}
                    >
                      <CustomIconButton
                        sx={{ p: 0.5 }}
                        onClick={() =>
                          profileModalRef.current?.open(player.summonerId)
                        }
                      >
                        <CircularIcon
                          src={profileIcon(player.profileIconId)}
                          size={28}
                        />
                      </CustomIconButton>
                      <Stack direction={'column'}>
                        <Typography whiteSpace={'nowrap'}>
                          {player.gameName}
                        </Typography>
                        <Typography fontSize={'0.7rem'} color={'textDisabled'}>
                          #{player.tagLine}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align={'center'}>
                    <Typography whiteSpace={'nowrap'}>
                      {player.wins} / {player.losses}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {formatCurrency(player.leaguePoints, 0)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <CustomIconButton
                      sx={{ p: 0.8 }}
                      onClick={() => startSpectate(player.puuid)}
                    >
                      <FaEye size={20} />
                    </CustomIconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <ProfileModal ref={profileModalRef} />
    </Stack>
  );
};
