import { Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const PartyTypeStatus = () => {
  const { rcpFeLolParties } = useLeagueTranslate();

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const partyType = lobbyStore.lobby.use((s) => s?.partyType ?? 'closed');

  return (
    <Typography fontSize={'0.75rem'}>
      {rcpFeLolPartiesTrans(
        partyType === 'open'
          ? 'parties_open_party_status_header'
          : 'parties_closed_party_status_header',
      )}
    </Typography>
  );
};
