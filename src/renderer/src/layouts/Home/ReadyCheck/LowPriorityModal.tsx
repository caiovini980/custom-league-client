import { Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { isEqual } from 'lodash-es';

interface LowPriorityModalProps {
  onQuitMatchmaking: () => void;
}

export const LowPriorityModal = ({
  onQuitMatchmaking,
}: LowPriorityModalProps) => {
  const { rcpFeLolParties } = useLeagueTranslate();
  const penaltyTimeRemaining = lobbyStore.matchMaking.use(
    (s) => s?.lowPriorityData.penaltyTimeRemaining ?? 0,
  );
  const penalizedSummonerIds = lobbyStore.matchMaking.use(
    (s) => s?.lowPriorityData.penalizedSummonerIds ?? [],
    isEqual,
  );
  const matchMakingPriorityReason = lobbyStore.matchMaking.use(
    (s) => s?.lowPriorityData.reason ?? '',
  );
  const currentSummonerId = currentSummonerStore.info.use(
    (s) => s?.summonerId ?? 0,
  );

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  return (
    <CustomDialog
      maxWidth={'sm'}
      fullWidth
      title={rcpFeLolPartiesTrans('low_priority_queue_modal_header')}
      open={!!matchMakingPriorityReason}
      handleConfirm={onQuitMatchmaking}
      labelBtnConfirm={rcpFeLolPartiesTrans('parties_button_quit_matchmaking')}
      hiddenBtnCancel
    >
      <Stack direction={'column'} alignItems={'center'}>
        <Typography>
          {penalizedSummonerIds.includes(currentSummonerId)
            ? rcpFeLolPartiesTrans('low_priority_queue_modal_self_body')
            : rcpFeLolPartiesTrans('parties_queue_error_leaver_busted_body')}
        </Typography>
        <Typography textAlign={'center'}>
          {rcpFeLolPartiesTrans('low_priority_queue_modal_timer_label')}
        </Typography>
        <Typography>{secondsToDisplayTime(penaltyTimeRemaining)}</Typography>
      </Stack>
    </CustomDialog>
  );
};
