import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';

interface ActionButtonProps {
  session: LolChampSelectV1Session;
}

export const ActionButton = ({ session }: ActionButtonProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties, rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');
  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const onClickActionButton = () => {
    if (session.allowRerolling) {
      makeRequest(
        'POST',
        '/lol-champ-select/v1/session/my-selection/reroll',
        undefined,
      );
    }
  };

  const getButtonLabel = () => {
    if (session.allowRerolling) {
      return rcpFeLolChampSelectTrans('random_icon_label');
    }
    return rcpFeLolPartiesTrans('parties_timeout_confirmation_ok');
  };

  const disabled = () => {
    if (session.allowRerolling) {
      return session.rerollsRemaining > 0;
    }
    return false;
  };

  return (
    <CustomButton
      variant={'contained'}
      onClick={onClickActionButton}
      disabled={disabled()}
    >
      {getButtonLabel()}
    </CustomButton>
  );
};
