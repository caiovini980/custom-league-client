import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';

export const LeagueClientEvent = () => {
  useLeagueClientEvent('all', (data, event) => {
    console.log(event, data);
  });

  return <></>;
};
