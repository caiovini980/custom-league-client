import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  LolMissionsV1Missions,
  LolMissionsV1MissionsObjectProgress,
} from '@shared/typings/lol/response/lolMissionsV1Missions';
import { MdCheckCircle } from 'react-icons/md';

interface MissionsProps {
  missions: LolMissionsV1Missions[];
}

export const Missions = ({ missions }: MissionsProps) => {
  const { lolGameDataImg } = useLeagueImage();
  const { rcpFeLolObjectives, rcpFeLolL10n } = useLeagueTranslate();
  const { mode } = useColorScheme();

  const { rcpFeLolObjectivesTrans } = rcpFeLolObjectives;
  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const getObjectiveDivider = (
    completionExpression: LolMissionsV1Missions['completionExpression'],
  ) => {
    if (!completionExpression) return null;
    return (
      <Divider flexItem orientation={'horizontal'} variant={'fullWidth'}>
        {rcpFeLolObjectivesTrans(
          completionExpression === '1 and 2'
            ? 'objectives_divider_text_and'
            : 'objectives_divider_text_or',
        )}
      </Divider>
    );
  };

  const getCurrentProgressText = (
    progress: LolMissionsV1MissionsObjectProgress,
  ) => {
    if (progress.totalCount >= 1000) {
      if (progress.currentProgress >= 1000) {
        return rcpFeLolL10nTrans(
          'postgame_gold_format_thousands',
          (progress.currentProgress / 1000).toPrecision(2),
        );
      }
      return progress.currentProgress;
    }
    return `${progress.currentProgress}/${progress.totalCount}`;
  };

  const getCurrentProgress = (
    progress: LolMissionsV1MissionsObjectProgress,
  ) => {
    return Math.floor((progress.currentProgress * 100) / progress.totalCount);
  };

  return (
    <Stack direction={'column'} overflow={'auto'} rowGap={3} p={0.5}>
      {missions.map((m) => {
        return (
          <Tooltip
            key={`${m.id}-${m.sequence}`}
            disableInteractive
            title={
              m.description ? (
                <Typography
                  fontSize={'0.8rem'}
                  dangerouslySetInnerHTML={{ __html: m.description }}
                />
              ) : (
                ''
              )
            }
            slotProps={{
              tooltip: {
                sx: {
                  boxShadow: 'unset',
                  background: 'var(--mui-palette-background-paper)',
                  border: '1px solid var(--mui-palette-divider)',
                },
              },
            }}
            placement={'auto'}
          >
            <Stack
              component={Paper}
              variant={'outlined'}
              direction={'row'}
              width={'100%'}
            >
              <Stack
                direction={'column'}
                divider={getObjectiveDivider(m.completionExpression)}
                width={'100%'}
                justifyContent={'center'}
                sx={{
                  position: 'relative',
                  zIndex: 0,
                  background:
                    mode === 'dark'
                      ? 'var(--mui-palette-grey-800)'
                      : 'var(--mui-palette-grey-50)',
                  '&::before': {
                    content: "''",
                    zIndex: -1,
                    inset: 0,
                    position: 'absolute',
                    background: m.media.backgroundUrl
                      ? `url(${lolGameDataImg(m.media.backgroundUrl)})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right',
                    maskImage:
                      'linear-gradient(to left, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0) 50%)',
                  },
                }}
              >
                {m.objectives.map((o, i) => {
                  return (
                    <Stack
                      key={i}
                      direction={'row'}
                      p={1}
                      minHeight={70}
                      alignItems={'center'}
                      columnGap={1}
                    >
                      <Stack
                        position={'relative'}
                        width={50}
                        height={50}
                        flexShrink={0}
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        <CircularProgress
                          sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                          }}
                          variant={'determinate'}
                          size={50}
                          value={getCurrentProgress(o.progress)}
                        />
                        <Typography fontSize={'0.8rem'}>
                          {getCurrentProgressText(o.progress)}
                        </Typography>
                      </Stack>
                      <Stack direction={'column'}>
                        <Typography fontSize={'0.7rem'} color={'warning'}>
                          {m.missionType === 'REPEATING' &&
                            rcpFeLolObjectivesTrans(
                              'objectives_title_recurring',
                            )}
                          {m.title}
                        </Typography>
                        <Typography
                          fontSize={'0.85rem'}
                          dangerouslySetInnerHTML={{ __html: o.description }}
                        />
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
              <Stack
                width={'120px'}
                flexShrink={0}
                justifyContent={'center'}
                alignItems={'center'}
                position={'relative'}
              >
                <Box
                  sx={{
                    display: m.status === 'COMPLETED' ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    zIndex: 2,
                    inset: 0,
                    background: (t) =>
                      alpha(t.palette.grey[mode === 'light' ? 200 : 700], 0.8),
                  }}
                >
                  <MdCheckCircle
                    size={30}
                    color={
                      mode === 'light'
                        ? 'var(--mui-palette-grey-800)'
                        : 'var(--mui-palette-grey-200)'
                    }
                  />
                </Box>
                <CircularIcon src={lolGameDataImg(m.rewards[0].iconUrl)} />
                <Typography textAlign={'center'} fontSize={'0.8rem'}>
                  {m.rewards[0].description}
                </Typography>
              </Stack>
            </Stack>
          </Tooltip>
        );
      })}
    </Stack>
  );
};
