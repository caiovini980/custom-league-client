import { Stack, Typography } from '@mui/material';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import CustomDialog from '@render/components/CustomDialog';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

interface LowPriorityModalProps {
  onQuitMatchmaking: () => void;
  currentSummonerId: number;
}

export const LowPriorityModal = ({
  onQuitMatchmaking,
  currentSummonerId,
}: LowPriorityModalProps) => {
  const { rcpFeLolParties } = useLeagueTranslate();
  const matchMaking = lobbyStore.matchMaking.use();

  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  return (
    <CustomDialog
      maxWidth={'sm'}
      fullWidth
      title={rcpFeLolPartiesTrans('low_priority_queue_modal_header')}
      open={!!matchMaking?.lowPriorityData.reason}
      handleConfirm={onQuitMatchmaking}
      labelBtnConfirm={rcpFeLolPartiesTrans('parties_button_quit_matchmaking')}
      hiddenBtnCancel
    >
      <Stack direction={'column'} alignItems={'center'}>
        <Typography>
          {matchMaking?.lowPriorityData.penalizedSummonerIds.includes(
            currentSummonerId,
          )
            ? rcpFeLolPartiesTrans('low_priority_queue_modal_self_body')
            : rcpFeLolPartiesTrans('parties_queue_error_leaver_busted_body')}
        </Typography>
        <Typography textAlign={'center'}>
          {rcpFeLolPartiesTrans('low_priority_queue_modal_timer_label')}
        </Typography>
        <Typography>
          {secondsToDisplayTime(
            matchMaking?.lowPriorityData.penaltyTimeRemaining ?? 0,
          )}
        </Typography>
      </Stack>
    </CustomDialog>
  );
};
