import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useStore } from '@render/zustand/store';
import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SpellSelect } from '@render/layouts/Lobby/ChampSelect/SpellSelect';
import { ActionButton } from '@render/layouts/Lobby/ChampSelect/ActionButton';
import { SquareIcon } from '@render/components/SquareIcon';
import { getSummonerFromTeamUtil } from '@render/layouts/Lobby/ChampSelect/getSummonerFromTeamUtil';

interface ChampionSelectListProps {
  session: LolChampSelectV1Session;
}

export const ChampionSelectList = ({ session }: ChampionSelectListProps) => {
  const champions = useStore().gameData.champions();
  const { championIcon, loadChampionBackgroundImg } = useLeagueImage();

  useLeagueClientEvent('/lol-champ-select/v1/bannable-champion-ids', (data) => {
    console.log(data);
  });
  useLeagueClientEvent('/lol-champ-select/v1/disabled-champion-ids', (data) => {
    console.log(data);
  });
  useLeagueClientEvent('/lol-champ-select/v1/pickable-champion-ids', (data) => {
    console.log(data);
  });

  const championsBanned = [
    ...session.bans.myTeamBans,
    ...session.bans.theirTeamBans,
  ];

  const championFiltered = champions;
  const { championId, selectedSkinId } = getSummonerFromTeamUtil(session);

  if (championId > 0) {
    return (
      <Box
        width={'100%'}
        height={'100%'}
        sx={{
          background: `linear-gradient(0deg, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 100%), url(${loadChampionBackgroundImg(championId, selectedSkinId)})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    );
  }

  return (
    <Stack direction={'column'} rowGap={1}>
      <Grid
        container
        spacing={1}
        overflow={'auto'}
        height={'100%'}
        width={'100%'}
      >
        {championFiltered.map((c) => {
          return (
            <Grid key={c.id} size={2}>
              <Stack
                direction={'column'}
                rowGap={1}
                component={ButtonBase}
                alignItems={'center'}
                justifyContent={'space-between'}
                height={120}
                width={'100%'}
                disabled={championsBanned.includes(c.id)}
              >
                <SquareIcon
                  src={championIcon(c.id)}
                  grayScale={championsBanned.includes(c.id)}
                />
                <Typography fontSize={'0.7rem'}>{c.name}</Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
      <Stack direction={'column'} width={'100%'} justifyContent={'center'}>
        <ActionButton session={session} />
        <Stack
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography>Runes</Typography>
          <SpellSelect session={session} />
        </Stack>
      </Stack>
    </Stack>
  );
};
