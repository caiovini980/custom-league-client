import { CustomCheckBox } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const OpenPartyStatus = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const partyType = lobbyStore.lobby.use((s) => s?.partyType ?? 'closed');
  const allowedToggleInvite = lobbyStore.lobby.use(
    (s) => s?.localMember.allowedToggleInvite ?? false,
  );

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const toggleOpenGroup = (isOpen: boolean) => {
    makeRequest(
      'PUT',
      '/lol-lobby/v2/lobby/partyType',
      isOpen ? 'open' : 'closed',
    ).then();
  };

  return (
    <CustomCheckBox
      label={rcpFeLolPartiesTrans('parties_open_party_status_header')}
      checked={partyType === 'open'}
      onChange={toggleOpenGroup}
      disabled={!allowedToggleInvite}
    />
  );
};
