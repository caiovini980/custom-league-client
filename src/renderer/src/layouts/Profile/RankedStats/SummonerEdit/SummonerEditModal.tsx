import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { SummonerBackgroundChange } from '@render/layouts/Profile/RankedStats/SummonerEdit/BackgroundChange/SummonerBackgroundChange';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface SummonerEditModalRef {
  open: () => void;
}

export const SummonerEditModal = forwardRef<SummonerEditModalRef>((_, ref) => {
  const { rcpFeLolSharedComponents, rcpFeLolProfiles } = useLeagueTranslate();

  const { rcpFeLolSharedComponentsTransChallenges } = rcpFeLolSharedComponents;
  const { rcpFeLolProfilesTrans } = rcpFeLolProfiles;

  const [open, setOpenModal] = useState(false);

  const handleClose = () => setOpenModal(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpenModal(true),
    };
  }, []);

  return (
    <CustomDialog
      open={open}
      fullWidth
      maxWidth={'md'}
      actionsComponent={<div />}
      dialogContentProps={{
        sx: {
          p: 0,
          height: '50vh',
          background: 'var(--mui-palette-background-default)',
        },
      }}
    >
      <CustomDialogCloseFloatingButton handleClose={handleClose} />
      <CustomTab>
        <CustomTabPanel
          label={rcpFeLolSharedComponentsTransChallenges(
            'challenges_identity_customizer_title',
          )}
          name={'icon'}
        ></CustomTabPanel>
        <CustomTabPanel
          label={rcpFeLolProfilesTrans(
            'profile_backdrop_picker_button_tooltip',
          )}
          name={'background'}
        >
          <SummonerBackgroundChange />
        </CustomTabPanel>
      </CustomTab>
    </CustomDialog>
  );
});
