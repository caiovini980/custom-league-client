import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { ButtonBase, Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { getSummonerFromTeamUtil } from '@render/layouts/Lobby/ChampSelect/getSummonerFromTeamUtil';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

interface AramBenchChampionsProps {
  session: LolChampSelectV1Session;
}

export const AramBenchChampions = ({ session }: AramBenchChampionsProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { championIcon } = useLeagueImage();

  if (!session.benchEnabled) return;

  const onClickChampion = (championId: number) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-champ-select/v1/session/bench/swap/{digits}',
        championId,
      ),
      undefined,
    );
  };

  const getCurrentChampionId = () => {
    return getSummonerFromTeamUtil(session).championId;
  };

  return (
    <Stack
      direction={'row'}
      columnGap={0.5}
      height={35}
      width={'100%'}
      justifyContent={'center'}
    >
      {session.benchChampions.map((_bc, i) => {
        return (
          <ButtonBase
            key={i}
            onClick={() => onClickChampion(i)}
            disabled={getCurrentChampionId() === i}
          >
            <SquareIcon
              src={championIcon(getCurrentChampionId())}
              size={30}
              grayScale={getCurrentChampionId() === i}
            />
          </ButtonBase>
        );
      })}
    </Stack>
  );
};
