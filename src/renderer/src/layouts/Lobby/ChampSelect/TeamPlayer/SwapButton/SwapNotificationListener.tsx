import { Fade, Paper, Popper } from '@mui/material';
import { useAudio } from '@render/hooks/useAudioManager';
import {
  PositionSwapProps,
  SwapNotification,
} from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapButton/SwapNotification';
import {
  champSelectStore,
  SwapType,
} from '@render/zustand/stores/champSelectStore';
import { useEffect } from 'react';

interface SwapNotificationListenerProps {
  slotId: number;
  summonerName: string;
  onChangeContentShow: (show: boolean) => void;
}

export const SwapNotificationListener = ({
  slotId,
  summonerName,
  onChangeContentShow,
}: SwapNotificationListenerProps) => {
  const swapData = champSelectStore.swapData.use((s) => s[slotId]);
  const sfxSwapRequest = useAudio('sfx-cs-notif-swaprequest-rcvd');

  const getDescription = (swapData: SwapType) => {
    if (!swapData) return '';
    switch (swapData.type) {
      case 'POSITION':
        return swapData.responderPosition;
      case 'CHAMPION':
        return swapData.responderChampionName;
      case 'PICK_ORDER':
        return String(swapData.otherSummonerIndex + 1);
    }
  };

  const getSwapType = (swapData: SwapType): PositionSwapProps['type'] => {
    switch (swapData.type) {
      case 'POSITION':
        return 'position';
      case 'CHAMPION':
        return 'champion';
      case 'PICK_ORDER':
        return 'pick_order';
    }
  };

  useEffect(() => {
    onChangeContentShow(!!swapData);
    if (swapData?.state === 'RECEIVED') {
      sfxSwapRequest.play();
    }
  }, [swapData]);

  return (
    <Popper
      open={!!swapData}
      anchorEl={document.getElementById(`swap-icon-${slotId}`)}
      placement={'right'}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <Paper
            variant={'outlined'}
            sx={{
              width: 350,
            }}
          >
            {swapData && (
              <SwapNotification
                type={getSwapType(swapData)}
                summonerName={summonerName}
                swapId={swapData.id}
                swapState={swapData.state}
                actionDescription={getDescription(swapData)}
                onCompleteAction={() => champSelectStore.removeSwapData(slotId)}
              />
            )}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
