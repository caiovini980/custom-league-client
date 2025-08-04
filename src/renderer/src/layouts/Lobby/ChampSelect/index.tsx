import { Stack } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { CenterArea } from '@render/layouts/Lobby/ChampSelect/CenterArea';
import { Runes } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes';
import { SpellSelect } from '@render/layouts/Lobby/ChampSelect/CenterArea/SpellSelect';
import { ChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { Legacy } from '@render/layouts/Lobby/ChampSelect/Legacy';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import { ChatGroup } from '@render/layouts/Lobby/ChatGroup';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

interface ChampSelectProps {
  gameMode: string;
}

export const ChampSelect = ({ gameMode }: ChampSelectProps) => {
  const session = lobbyStore.champSelect.use();

  if (!session) {
    return <LoadingScreen fullArea />;
  }

  if (session.isLegacyChampSelect) {
    return <Legacy gameMode={gameMode} />;
  }

  return (
    <ChampSelectContext session={session} gameMode={gameMode}>
      <Stack
        direction={'column'}
        height={'100%'}
        width={'100%'}
        overflow={'auto'}
        p={1}
        rowGap={1}
      >
        <Timer />
        <AramBenchChampions />
        <Stack
          direction={'row'}
          columnGap={1}
          justifyContent={'space-between'}
          height={'100%'}
          overflow={'auto'}
        >
          <TeamPlayer />
          <CenterArea />
          <TeamPlayer isEnemyTeam />
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <ChatGroup
            mucJwtDto={session.chatDetails.mucJwtDto}
            chatHeight={150}
          />
          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            columnGap={2}
          >
            <Runes />
            <SpellSelect />
          </Stack>
          <div style={{ width: '30%' }} />
        </Stack>
      </Stack>
    </ChampSelectContext>
  );
};
