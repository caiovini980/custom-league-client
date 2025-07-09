import { ButtonBase, Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';

export const AramBenchChampions = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { championIcon } = useLeagueImage();
  const { session, currentPlayer } = useChampSelectContext();

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
    return currentPlayer.championId;
  };

  return (
    <Stack
      direction={'row'}
      columnGap={1}
      width={'100%'}
      justifyContent={'center'}
    >
      {session.benchChampions.map((bc) => {
        return (
          <ButtonBase
            key={bc.championId}
            onClick={() => onClickChampion(bc.championId)}
            disabled={getCurrentChampionId() === bc.championId}
          >
            <SquareIcon
              src={championIcon(bc.championId)}
              size={40}
              grayScale={getCurrentChampionId() === bc.championId}
            />
          </ButtonBase>
        );
      })}
    </Stack>
  );
};
