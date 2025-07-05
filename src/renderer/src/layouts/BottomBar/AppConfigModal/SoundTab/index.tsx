import { Box, Stack } from '@mui/material';
import { LabelAction } from '@render/layouts/BottomBar/AppConfigModal/LabelAction';
import { VolumeBar } from '@render/layouts/BottomBar/VolumeBar';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export const SoundTab = () => {
  const { rcpFeLolSettings } = useLeagueTranslate();

  const { rcpFeLolSettingsTrans } = rcpFeLolSettings;

  return (
    <Stack direction={'column'} rowGap={1} p={1}>
      <LabelAction
        label={rcpFeLolSettingsTrans('LOL_SETTINGS_INGAME_SOUND_MASTER_VOLUME')}
        action={
          <Box width={200} pr={2} pt={2}>
            <VolumeBar />
          </Box>
        }
      />
    </Stack>
  );
};
