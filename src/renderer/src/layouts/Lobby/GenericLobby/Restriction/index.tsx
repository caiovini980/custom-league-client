import AlertBox from '@render/components/AlertBox';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';

export const Restriction = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const restrictions = lobbyStore.lobby.use((s) => s?.restrictions ?? []);

  const [summoners, setSummoners] = useState<LolSummonerV1Summoners_Id[]>([]);

  useEffect(() => {
    if (!restrictions.length) return;
    const summonerIds = JSON.stringify(restrictions[0].summonerIds);
    makeRequest(
      'GET',
      buildEventUrl('/lol-summoner/v2/summoners?ids={digits}', summonerIds),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setSummoners(res.body);
      }
    });
  }, [restrictions.length]);

  const getFirstRestriction = () => {
    const firstRestriction = restrictions[0];
    if (firstRestriction) {
      const errorKey = `game_select_queue_restriction_party_${firstRestriction.restrictionCode.toLowerCase()}`;
      const playerNames = summoners.map((s) => s.gameName).join(', ');
      const restrictionArgs = Object.values(firstRestriction.restrictionArgs);
      return rcpFeLolPartiesTrans(errorKey, ...restrictionArgs, playerNames);
    }
    return '';
  };

  if (!restrictions.length) return;

  return <AlertBox type={'error'} message={getFirstRestriction()} />;
};
