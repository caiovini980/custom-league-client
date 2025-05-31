import { useStore } from '@render/zustand/store';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useNavigate } from 'react-router-dom';
import { electronHandle } from '@render/utils/electronFunction.util';

export const ChampSelectFocus = () => {
  const navigate = useNavigate();
  const session = useStore().lobby.champSelect();

  useLeagueClientEvent(
    buildEventUrl('/lol-champ-select/v1/summoners/{digits}', getSlotId()),
    (data) => {
      if (data.isActingNow) {
        electronHandle.client.priorityApp();
        navigate('/lobby');
      }
    },
    {
      deps: [session?.localPlayerCellId],
    },
  );

  function getSlotId() {
    return (
      session?.myTeam.findIndex(
        (t) => t.cellId === session?.localPlayerCellId,
      ) ?? -1
    );
  }

  return <></>;
};
