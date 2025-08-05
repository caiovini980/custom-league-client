import { CustomCheckBox } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const AutoAcceptCheckBox = () => {
  const { rcpFeLolL10n } = useLeagueTranslate();

  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const autoAccept = lobbyStore.autoAccept.use();

  return (
    <CustomCheckBox
      label={`Auto ${rcpFeLolL10nTrans('ready_check_accept_button')}`}
      checked={autoAccept}
      onChange={lobbyStore.autoAccept.set}
    />
  );
};
