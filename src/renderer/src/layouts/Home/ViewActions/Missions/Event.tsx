import {
  LinearProgress,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomButton } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { EventTime } from '@render/layouts/Home/ViewActions/Missions/EventTime';
import { LolEventHubV1Events_Id_RewardTrackItems } from '@shared/typings/lol/response/lolEventHubV1Events_Id_RewardTrackItems';
import { LolEventHubV1Events_Id_RewardTrackProgress } from '@shared/typings/lol/response/lolEventHubV1Events_Id_RewardTrackProgress';
import { useEffect, useRef, useState } from 'react';
import { MdLock } from 'react-icons/md';

interface EventProps {
  eventId: string;
  progressEndDate: string;
}

export const Event = ({ eventId, progressEndDate }: EventProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();
  const { rcpFeLolObjectives, rcpFeLolEventHub, rcpFeLolL10n } =
    useLeagueTranslate();

  const { rcpFeLolObjectivesTrans } = rcpFeLolObjectives;
  const { rcpFeLolEventHubTrans } = rcpFeLolEventHub;
  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const stepperContainerRef = useRef<HTMLDivElement>(null);

  const [rewardItems, setRewardItems] = useState<
    LolEventHubV1Events_Id_RewardTrackItems[]
  >([]);
  const [progress, setProgress] =
    useState<LolEventHubV1Events_Id_RewardTrackProgress>();
  const [isClaim, setIsClaim] = useState(false);
  const [rewardSelected, setRewardSelected] = useState(0);

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-event-hub/v1/events/{uuid}/reward-track/items',
      eventId,
    ),
    (data) => {
      setRewardItems(data);
    },
    {
      deps: [eventId],
    },
  );

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-event-hub/v1/events/{uuid}/reward-track/progress',
      eventId,
    ),
    (data) => {
      setProgress(data);
      setRewardSelected(data.level);
      setTimeout(() => {
        scrollToCurrentLevel(data.level);
      }, 400);
    },
    {
      deps: [eventId],
    },
  );

  const scrollToCurrentLevel = (level: number) => {
    const currLevel = document.getElementById(`level-${level}`);
    currLevel?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  };

  const totalToClaim = () => {
    return rewardItems.filter((r) => r.rewardOptions[0].state === 'Unselected')
      .length;
  };

  const getPassText = () => {
    if (!progress) return '';
    if (progress.level === progress.totalLevels) {
      return rcpFeLolEventHubTrans('event_hub_pass_complete');
    }
    return `${progress.currentLevelXP} / ${progress.totalLevelXP} ${rcpFeLolObjectivesTrans('objectives_battlepass_xp')}`;
  };

  const onClickClaimAll = () => {
    setIsClaim(true);
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-event-hub/v1/events/{uuid}/reward-track/claim-all',
        eventId,
      ),
      undefined,
    ).then(() => {
      setIsClaim(false);
    });
  };

  const currentReward = rewardItems.find(
    (r) => Number(r.threshold) === rewardSelected,
  )?.rewardOptions[0];

  useEffect(() => {
    const container = stepperContainerRef.current;
    if (!container) return;
    if (!progress) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [progress]);

  useEffect(() => {
    scrollToCurrentLevel(rewardSelected);
  }, [rewardSelected]);

  if (!progress) return null;

  return (
    <Stack direction={'column'} overflow={'auto'} height={'100%'}>
      <Stack
        direction={'row'}
        p={2}
        alignItems={'center'}
        justifyContent={'space-between'}
        position={'relative'}
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          '&::before': {
            content: "''",
            position: 'absolute',
            left: 0,
            height: '100%',
            width: `${(progress.currentLevelXP * 100) / progress.totalLevelXP}%`,
            maxWidth: '100%',
            background: (t) => alpha(t.palette.secondary.main, 0.3),
          },
        }}
      >
        <Stack direction={'column'}>
          <Typography>
            {rcpFeLolObjectivesTrans('season_pass_level', progress.level)}
          </Typography>
          <Typography>{getPassText()}</Typography>
          <EventTime progressEndDate={progressEndDate} />
        </Stack>
        <CustomButton
          variant={'contained'}
          endIcon={totalToClaim()}
          color={'primary'}
          loading={isClaim}
          onClick={onClickClaimAll}
          disabled={totalToClaim() === 0}
        >
          {rcpFeLolEventHubTrans('event_shop_reward_button_claim_reward')}
        </CustomButton>
      </Stack>
      {currentReward && (
        <Stack
          direction={'column'}
          rowGap={1}
          alignItems={'center'}
          justifyContent={'center'}
          p={1}
          height={'100%'}
          borderBottom={'1px solid var(--mui-palette-divider)'}
        >
          <SquareIcon
            src={lolGameDataImg(currentReward.thumbIconPath)}
            size={260}
          />
          <Typography color={'primary'}>{currentReward.rewardName}</Typography>
          <Typography>{currentReward.rewardDescription}</Typography>
        </Stack>
      )}
      <Stack
        ref={stepperContainerRef}
        overflow={'auto'}
        flexShrink={0}
        height={220}
        justifyContent={'center'}
      >
        <Stepper
          nonLinear
          orientation={'horizontal'}
          alternativeLabel
          connector={null}
        >
          {rewardItems.map((ri, i) => {
            const reward = ri.rewardOptions[0];
            const isActive = progress.level >= Number(ri.threshold);

            const getProgressBarValue = () => {
              if (isActive) return 100;
              if (progress.level + 1 === Number(ri.threshold)) {
                return (progress.currentLevelXP * 100) / progress.totalLevelXP;
              }
              return 0;
            };

            return (
              <Step
                key={ri.threshold}
                id={`level-${ri.threshold}`}
                active={isActive}
                completed={reward.state === 'Selected'}
              >
                <LinearProgress
                  variant={'determinate'}
                  value={getProgressBarValue()}
                  color={'secondary'}
                  sx={{
                    display: i === 0 ? 'none' : undefined,
                    position: 'absolute',
                    top: 25,
                    left: 'calc(-50% + 40px)',
                    right: 'calc(50% + 40px)',
                  }}
                />
                <StepButton
                  icon={
                    <Stack
                      alignItems={'center'}
                      sx={{
                        width: 120,
                        background:
                          rewardSelected === Number(ri.threshold)
                            ? 'radial-gradient(circle at center, var(--mui-palette-highlight) 0%, rgba(255, 255, 255, 0) 50%)'
                            : 'radial-gradient(circle at center, var(--mui-palette-divider) 0%, rgba(255, 255, 255, 0) 50%)',
                      }}
                    >
                      <CircularIcon
                        src={lolGameDataImg(reward.thumbIconPath)}
                        size={50}
                        grayScale={reward.state !== 'Unselected' ? 0.6 : 0}
                      />
                      <Typography>{ri.threshold}</Typography>
                    </Stack>
                  }
                  onClick={() => setRewardSelected(Number(ri.threshold))}
                >
                  <Typography
                    width={180}
                    flexShrink={0}
                    fontSize={'0.8rem'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    textAlign={'center'}
                    color={
                      reward.state === 'Locked'
                        ? 'var(--mui-palette-text-disabled)'
                        : 'var(--mui-palette-text-primary)'
                    }
                  >
                    {reward.headerType === 'FREE' ? (
                      `${rcpFeLolL10nTrans('reward_tracker_reward_item_header_override_Free')}`
                    ) : (
                      <MdLock size={24} />
                    )}
                  </Typography>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Stack>
    </Stack>
  );
};
