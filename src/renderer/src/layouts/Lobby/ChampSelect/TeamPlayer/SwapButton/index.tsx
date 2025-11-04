import { Box } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import {
  CustomIconButtonTooltip,
  CustomIconButtonTooltipRef,
} from '@render/components/input';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SwapActionTooltip } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapButton/SwapActionTooltip';
import { SwapNotificationListener } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapButton/SwapNotificationListener';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { useRef, useState } from 'react';

interface PositionSwapProps {
  slotId: number;
  cellId: number;
  summonerName: string;
  championName: string;
  position: string;
  showPositionSwap: boolean;
  showChampionSwap: boolean;
  showPickOrderSwap: boolean;
}

export const SwapButton = ({
  slotId,
  cellId,
  summonerName,
  championName,
  position,
  showChampionSwap,
  showPickOrderSwap,
  showPositionSwap,
}: PositionSwapProps) => {
  const { genericImg } = useLeagueImage();
  const currentCellId = champSelectStore.cellId.use();

  const tooltipRef = useRef<CustomIconButtonTooltipRef>(null);

  const [disableSwapBtn, setDisableSwapBtn] = useState(false);

  const onClickSwap = () => {
    tooltipRef.current?.close();
  };

  const showSwapButton = () => {
    if (cellId === currentCellId) return false;
    return !(!showPickOrderSwap && !showPositionSwap && !showChampionSwap);
  };

  return (
    <Box position={'relative'} id={`swap-icon-${slotId}`}>
      {showSwapButton() && (
        <CustomIconButtonTooltip
          ref={tooltipRef}
          openTooltipOnClick
          title={
            <SwapActionTooltip
              cellId={cellId}
              slotId={slotId}
              position={position}
              championName={championName}
              onClickSwap={onClickSwap}
            />
          }
          placement={'right'}
          disabled={disableSwapBtn}
          sx={{
            p: 0.5,
          }}
        >
          <CircularIcon
            size={25}
            src={genericImg(
              'plugins/rcp-fe-lol-champ-select/global/default/images/summoner/button-swap.png',
            )}
          />
        </CustomIconButtonTooltip>
      )}
      <SwapNotificationListener
        slotId={slotId}
        summonerName={summonerName}
        onChangeContentShow={setDisableSwapBtn}
      />
    </Box>
  );
};
