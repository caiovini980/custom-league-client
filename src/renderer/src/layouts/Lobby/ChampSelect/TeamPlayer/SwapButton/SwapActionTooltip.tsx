import { Stack, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { capitalize } from '@render/utils/stringUtil';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { ClientEndpointKeys } from '@shared/typings/lol/clientEndpoint';
import { LolChampSelectV1SessionSwap } from '@shared/typings/lol/response/lolChampSelectV1Session';

interface SwapActionTooltipProps {
  cellId: number;
  slotId: number;
  position: string;
  championName: string;
  onClickSwap: () => void;
}

export const SwapActionTooltip = ({
  cellId,
  slotId,
  position,
  championName,
  onClickSwap,
}: SwapActionTooltipProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const pickOrderSwaps = champSelectStore.getSessionData(
    (s) => s.pickOrderSwaps,
  );
  const positionSwaps = champSelectStore.getSessionData((s) => s.positionSwaps);
  const trades = champSelectStore.getSessionData((s) => s.trades);
  const areSummonerActionsComplete = champSelectStore.getCurrentSummonerData(
    (s) => s.areSummonerActionsComplete,
    false,
  );

  const getSwapId = (swapData: LolChampSelectV1SessionSwap[]) => {
    return (
      swapData.find((p) => p.cellId === cellId && p.state === 'AVAILABLE')
        ?.id ?? -1
    );
  };

  const positionSwapId = getSwapId(positionSwaps);
  const pickSwapId = getSwapId(pickOrderSwaps);
  const championSwapId = getSwapId(trades);

  const handleSwap = (
    type: 'position' | 'pick-order' | 'champion',
    swapId: number,
  ) => {
    const url =
      `/lol-champ-select/v1/session/${type}-swaps/${swapId}/request` as ClientEndpointKeys;

    makeRequest('POST', url, undefined).then(() => {
      onClickSwap();
    });
  };

  return (
    <Stack direction={'column'} p={1} rowGap={2}>
      <Typography textAlign={'center'}>
        {rcpFeLolChampSelectTrans('swap_request_title_local_player')}
      </Typography>
      {pickSwapId !== -1 && !areSummonerActionsComplete && (
        <CustomButton
          variant={'contained'}
          onClick={() => handleSwap('pick-order', pickSwapId)}
        >
          {rcpFeLolChampSelectTrans(
            'swap_request_button_pick_order',
            slotId + 1,
          )}
        </CustomButton>
      )}
      {positionSwapId !== -1 && (
        <CustomButton
          variant={'contained'}
          onClick={() => handleSwap('position', positionSwapId)}
        >
          {capitalize(
            rcpFeLolChampSelectTrans(
              'swap_request_button_position',
              rcpFeLolChampSelectTrans(
                `summoner_assigned_position_${position}`,
              ),
            ),
          )}
        </CustomButton>
      )}
      {championSwapId !== -1 && (
        <CustomButton
          variant={'contained'}
          onClick={() => handleSwap('champion', championSwapId)}
        >
          {capitalize(championName)}
        </CustomButton>
      )}
    </Stack>
  );
};
