import { List, ListItem, ListItemText } from '@mui/material';
import { alpha } from '@mui/material/styles';
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
    buildEventUrl('/lol-match-history/v1/products/lol/{uuid}/matches', puuid),
    (data) => {
      setMatchHistory(data);
    },
  );

  return (
    <List
      disablePadding
      sx={{
        overflow: 'auto',
        width: 800,
        background: (t) => alpha(t.palette.background.default, 0.3),
        backdropFilter: 'blur(5px)',
      }}
    >
      <LoadingScreen
        loading={!matchHistory}
        height={'100%'}
        loadingText={'Loading history...'}
        fullArea
      />
      {!matchHistory?.games.games.length && (
        <ListItem>
          <ListItemText
            sx={{ textAlign: 'center' }}
            primary={'No game history'}
          />
        </ListItem>
      )}
      {matchHistory?.games.games.map((g) => (
        <GameHistoryItem key={g.gameId} game={g} />
      ))}
    </List>
  );
};
