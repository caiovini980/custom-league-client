import { Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { useEffect, useState } from 'react';

export const MatchMakingErrorModal = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const currentSummoner = currentSummonerStore.info.use();
  const errors = lobbyStore.matchMaking.use((s) => s?.errors ?? []);

  const [openModal, setOpenModal] = useState(false);
  const [summonersName, setSummonersName] = useState<Record<string, string>>(
    {},
  );

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  useEffect(() => {
    setOpenModal(!!errors.length);
    if (errors.length > 0) {
      const ids = errors.map((e) => e.penalizedSummonerId);
      makeRequest(
        'GET',
        buildEventUrl(
          '/lol-summoner/v2/summoners?ids={digits}',
          JSON.stringify(ids),
        ),
        undefined,
      ).then((res) => {
        if (res.ok) {
          const summonerNameMap: Record<number, string> = {};
          res.body.forEach((s) => {
            summonerNameMap[s.summonerId] = s.gameName;
          });
          setSummonersName(summonerNameMap);
        }
      });
    }
  }, [errors.length]);

  const getFailerInfo = (summonerId: number, errorType: string) => {
    const isCurrentSummoner = summonerId === currentSummoner?.summonerId;
    const mySelfError = rcpFeLolPartiesTrans(
      `parties_queue_error_${errorType}_myself_body`,
    );
    const otherError = rcpFeLolPartiesTrans(
      `parties_queue_error_${errorType}_other_body`,
      summonersName[summonerId],
    );

    return {
      title: rcpFeLolPartiesTrans(`parties_${errorType}_timer`),
      header: rcpFeLolPartiesTrans(`parties_queue_error_${errorType}_header`),
      body: isCurrentSummoner ? mySelfError : otherError,
    };
  };

  const getMessage = (err: LolMatchmakingV1Search['errors'][number]) => {
    const errTypeMapper: Record<string, string> = {
      READY_CHECK_FAILER: 'ready_check_failer',
      QUEUE_DODGER: 'queue_dodge',
    };

    const errorType = errTypeMapper[err.errorType];

    if (!errorType) {
      return <Typography>Err: {err.errorType}</Typography>;
    }

    const errInfo = getFailerInfo(err.penalizedSummonerId, errorType);

    return (
      <>
        <Typography textAlign={'center'} fontSize={'1.2rem'}>
          {errInfo.title}
        </Typography>
        <Typography textAlign={'center'}>{errInfo.header}</Typography>
        <Typography fontSize={'0.8rem'}>{errInfo.body}</Typography>
      </>
    );
  };

  return (
    <CustomDialog
      title={rcpFeLolPartiesTrans('parties_queue_error_generic_header')}
      open={openModal}
      handleConfirm={() => setOpenModal(false)}
      labelBtnConfirm={'OK'}
      hiddenBtnCancel
      confirmButtonProps={{
        variant: 'outlined',
        sx: {
          width: '100%',
        },
      }}
    >
      {errors.map((e) => (
        <Stack key={e.id} direction={'column'} rowGap={2}>
          {getMessage(e)}
          <Typography textAlign={'center'}>
            {secondsToDisplayTime(e.penaltyTimeRemaining)}
          </Typography>
        </Stack>
      ))}
    </CustomDialog>
  );
};
