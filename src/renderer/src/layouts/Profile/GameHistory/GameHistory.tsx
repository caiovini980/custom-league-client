import { List, ListItem, ListItemText } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { GameHistoryItem } from '@render/layouts/Profile/GameHistory/GameHistoryItem';
import { useState } from 'react';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';
import { useRunOnce } from '@render/hooks/useRunOnce';

interface GameHistoryProps {
  puuid: string;
}

export const GameHistory = ({ puuid }: GameHistoryProps) => {
  const { makeRequest } = useLeagueClientRequest();

  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState<LolMatchHistoryV1Games_Id[]>(
    [],
  );

  const loadMore = () => {
    setLoading(true);
    const url = buildEventUrl(
      '/lol-match-history/v1/products/lol/{uuid}/matches?begIndex={digits}&endIndex={digits}',
      puuid,
      0,
      20,
    );

    makeRequest('GET', url, undefined).then((res) => {
      setLoading(false);
      if (res.ok) {
        setMatchHistory(res.body.games.games);
      }
    });
  };

  useRunOnce(() => {
    loadMore();
  });

  return (
    <List
      disablePadding
      sx={{
        overflow: 'auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LoadingScreen loading={loading} height={'100%'} fullArea />
      {matchHistory.length === 0 && (
        <ListItem>
          <ListItemText
            sx={{ textAlign: 'center' }}
            primary={'No game history'}
          />
        </ListItem>
      )}
      {matchHistory.map((g) => (
        <GameHistoryItem key={g.gameId} game={g} puuid={puuid} />
      ))}
    </List>
  );
};
