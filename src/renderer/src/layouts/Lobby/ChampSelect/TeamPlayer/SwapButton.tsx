import {
  CustomButton,
  CustomIconButtonTooltip,
} from '@render/components/input';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useEffect, useState } from 'react';
import { LolChampSelectV1OngoingPickOrderSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPickOrderSwap';
import { LolChampSelectV1OngoingPositionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPositionSwap';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { SwapNotification } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapNotification';
import { capitalize } from '@render/utils/stringUtil';
import { ClientEndpointKeys } from '@shared/typings/lol/clientEndpoint';
import { LolChampSelectV1OngoingChampionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingChampionSwap';

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
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { session, currentCellId, areSummonerActionsComplete } =
    useChampSelectContext();

  const [openSwapTooltip, setOpenModalTooltip] = useState(false);
  const [pickOrderSwapData, setPickOrderSwapData] =
    useState<LolChampSelectV1OngoingPickOrderSwap>();
  const [positionSwapData, setPositionSwapData] =
    useState<LolChampSelectV1OngoingPositionSwap>();
  const [championSwapData, setChampionSwapData] =
    useState<LolChampSelectV1OngoingChampionSwap>();

  useLeagueClientEvent(
    '/lol-champ-select/v1/ongoing-pick-order-swap',
    (data) => {
      setPickOrderSwapData(data);
    },
  );

  useLeagueClientEvent('/lol-champ-select/v1/ongoing-position-swap', (data) => {
    setPositionSwapData(data);
  });

  useLeagueClientEvent('/lol-champ-select/v1/ongoing-champion-swap', (data) => {
    setChampionSwapData(data);
  });

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const onClickSwap = (
    type: 'position' | 'pick-order' | 'champion',
    swapId: number,
  ) => {
    const url =
      `/lol-champ-select/v1/session/${type}-swaps/{digits}/request` as ClientEndpointKeys;

    makeRequest('POST', buildEventUrl(url, swapId), undefined);
  };

  const swapsTooltip = () => {
    const { pickOrderSwaps, positionSwaps, trades } = session;

    const positionSwapId =
      positionSwaps.find((p) => p.cellId === cellId && p.state === 'AVAILABLE')
        ?.id ?? -1;
    const pickSwapId =
      pickOrderSwaps.find((p) => p.cellId === cellId && p.state === 'AVAILABLE')
        ?.id ?? -1;
    const championSwapId =
      trades.find((p) => p.cellId === cellId && p.state === 'AVAILABLE')?.id ??
      -1;

    return (
      <Stack direction={'column'} p={1} rowGap={2}>
        <Typography textAlign={'center'}>
          {rcpFeLolChampSelectTrans('swap_request_title_local_player')}
        </Typography>
        {pickSwapId !== -1 && !areSummonerActionsComplete && (
          <CustomButton
            variant={'contained'}
            onClick={() => onClickSwap('pick-order', pickSwapId)}
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
            onClick={() => onClickSwap('position', positionSwapId)}
          >
            {rcpFeLolChampSelectTrans(
              'swap_request_button_position',
              capitalize(position),
            )}
          </CustomButton>
        )}
        {championSwapId !== -1 && (
          <CustomButton
            variant={'contained'}
            onClick={() => onClickSwap('champion', championSwapId)}
          >
            {capitalize(championName)}
          </CustomButton>
        )}
      </Stack>
    );
  };

  const swapNotification = () => {
    if (positionSwapData?.otherSummonerIndex === slotId) {
      return (
        <SwapNotification
          type={'position'}
          summonerName={summonerName}
          swapId={positionSwapData.id}
          swapState={positionSwapData.state}
          actionDescription={positionSwapData.requesterPosition}
          onCompleteAction={() => setPositionSwapData(undefined)}
        />
      );
    }
    if (pickOrderSwapData?.otherSummonerIndex === slotId) {
      return (
        <SwapNotification
          type={'pick_order'}
          summonerName={summonerName}
          swapId={pickOrderSwapData.id}
          swapState={pickOrderSwapData.state}
          actionDescription={String(slotId + 1)}
          onCompleteAction={() => setPickOrderSwapData(undefined)}
        />
      );
    }
    if (championSwapData?.otherSummonerIndex === slotId) {
      return (
        <SwapNotification
          type={'champion'}
          summonerName={summonerName}
          swapId={championSwapData.id}
          swapState={championSwapData.state}
          actionDescription={championSwapData.requesterChampionName}
          onCompleteAction={() => setChampionSwapData(undefined)}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    if (positionSwapData) {
      setOpenModalTooltip(positionSwapData.otherSummonerIndex === slotId);
      return;
    }
    if (pickOrderSwapData) {
      setOpenModalTooltip(pickOrderSwapData.otherSummonerIndex === slotId);
      return;
    }
    if (championSwapData) {
      setOpenModalTooltip(championSwapData.otherSummonerIndex === slotId);
      return;
    }
    setOpenModalTooltip(false);
  }, [positionSwapData, pickOrderSwapData, championSwapData]);

  if (cellId === currentCellId) return null;
  if (!showPickOrderSwap && !showPositionSwap && !showChampionSwap) return null;

  return (
    <Tooltip
      open={openSwapTooltip}
      title={swapNotification()}
      placement={'right'}
      disableFocusListener
      disableTouchListener
      disableHoverListener
      arrow
      slotProps={{
        tooltip: {
          sx: {
            p: 0,
            background: (t) => t.palette.grey['800'],
          },
        },
      }}
    >
      <span>
        <CustomIconButtonTooltip
          openTooltipOnClick
          title={swapsTooltip()}
          placement={'right'}
          disabled={openSwapTooltip}
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
      </span>
    </Tooltip>
  );
};
