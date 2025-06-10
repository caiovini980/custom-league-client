import { List, ListItem, ListItemText } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { GameHistoryItem } from '@render/layouts/Profile/GameHistory/GameHistoryItem';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { useState } from 'react';

interface GameHistoryProps {
  puuid: string;
}

export const GameHistory = ({ puuid }: GameHistoryProps) => {
  const [matchHistory, setMatchHistory] =
    useState<LolMatchHistoryV1productsLol_Id_Matches>();

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-match-history/v1/products/lol/{uuid}/matches?begIndex={digits}&endIndex={digits}',
      puuid,
      0,
      30,
    ),
    (data) => {
      setMatchHistory(data);
    },
  );

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
      <LoadingScreen loading={!matchHistory} height={'100%'} fullArea />
      {matchHistory?.games.games.length === 0 && (
        <ListItem>
          <ListItemText
            sx={{ textAlign: 'center' }}
            primary={'No game history'}
          />
        </ListItem>
      )}
      {matchHistory?.games.games.map((g) => (
        <GameHistoryItem key={g.gameId} game={g} puuid={puuid} />
      ))}
    </List>
  );
};
