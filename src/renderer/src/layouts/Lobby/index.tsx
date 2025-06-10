import { Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChampSelect } from '@render/layouts/Lobby/ChampSelect';
import { GenericLobby } from '@render/layouts/Lobby/GenericLobby';
import { useStore } from '@render/zustand/store';
import { PatcherV1ProductsLeagueOfLegendStateComponent } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { useState } from 'react';
import { InGame } from '@render/layouts/Lobby/InGame';
import { Reconnect } from '@render/layouts/Lobby/Reconnect';
import { PreEndGame } from '@render/layouts/Lobby/PreEndGame';
import { QueueList } from '@render/layouts/Lobby/QueueList';
import { EndOfGame } from '@render/layouts/Lobby/EndOfGame';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { EndGameActionButton } from '@render/layouts/Lobby/EndOfGame/EndGameActionButton';

export const Lobby = () => {
  const { rcpFeLolL10n } = useLeagueTranslate();

  const isAvailable = useStore().leagueClient.isAvailable();

  const gameFlow = useStore().lobby.gameFlow();

  const [patchingData, setPatchingData] =
    useState<PatcherV1ProductsLeagueOfLegendStateComponent['progress']>(null);

  useLeagueClientEvent(
    '/patcher/v1/products/league_of_legends/state',
    (data) => {
      if (data.action === 'Patching' && data.components[0]?.progress) {
        setPatchingData(data.components[0].progress);
      } else {
        setPatchingData(null);
      }
    },
  );

  if (patchingData) {
    const msg = rcpFeLolL10n('trans')(
      `patcher_primary_work_${patchingData.primaryWork.toLowerCase()}`,
    );
    const calcPercent = (total: number, current: number) => {
      return Math.floor((current * 100) / total);
    };
    const { network, total } = patchingData;
    const percentBuffer = calcPercent(
      network.bytesRequired,
      network.bytesComplete,
    );
    const percentValue = calcPercent(total.bytesRequired, total.bytesComplete);
    return (
      <Stack
        direction={'column'}
        rowGap={1}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography>{msg}</Typography>
        <Stack
          direction={'row'}
          columnGap={1}
          alignItems={'center'}
          width={'80%'}
        >
          <LinearProgress
            variant={'buffer'}
            value={percentValue}
            valueBuffer={percentBuffer}
            sx={{
              width: '100%',
            }}
          />
          <Typography>{percentValue}%</Typography>
        </Stack>
      </Stack>
    );
  }

  if (!isAvailable) {
    return (
      <CentralizedStack>
        <LoadingScreen height={'100%'} />
      </CentralizedStack>
    );
  }

  if (['WaitingForStats', 'GameStart'].includes(gameFlow?.phase ?? 'None')) {
    return (
      <CentralizedStack>
        <LoadingScreen height={'100%'} />
        <EndGameActionButton />
      </CentralizedStack>
    );
  }

  if (gameFlow?.phase === 'ChampSelect') {
    return <ChampSelect gameMode={gameFlow?.gameData.queue.gameMode} />;
  }

  if (gameFlow?.phase === 'InProgress') {
    return <InGame />;
  }

  if (['FailedToLaunch', 'Reconnect'].includes(gameFlow?.phase ?? '')) {
    return <Reconnect />;
  }

  if (gameFlow?.phase === 'PreEndOfGame') {
    return <PreEndGame />;
  }

  if (gameFlow?.phase === 'EndOfGame') {
    return <EndOfGame />;
  }

  return (
    <Stack
      direction={'row'}
      height={'100%'}
      width={'100%'}
      overflow={'auto'}
      position={'relative'}
    >
      <QueueList />
      <Divider orientation={'vertical'} />
      <GenericLobby />
    </Stack>
  );
};
