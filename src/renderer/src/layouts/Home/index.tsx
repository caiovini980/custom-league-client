import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Home/Profile/ProfileModal';
import { SummonerInfo } from '@render/layouts/Home/SummonerInfo';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export const Home = ({ children }: PropsWithChildren) => {
  const { gameData } = useElectronHandle();

  const profileModal = useRef<ProfileModalRef>(null);

  const isAvailable = useStore().leagueClient.isAvailable();
  const {
    version: setVersion,
    language: setLanguage,
    filePath: setFilePath,
  } = storeActions.leagueClient;
  const { champions: setChampions } = storeActions.champion;

  const [loadingGameData, setLoadingGameData] = useState(true);

  useEffect(() => {
    setLoadingGameData(true);
    gameData
      .loadGameData()
      .then((data) => {
        setVersion(data.version);
        setLanguage(data.language);
        setChampions(data.championData);
        setFilePath(data.filePath);
        setLoadingGameData(false);
      })
      .catch((err) => {
        console.log('game data err', err);
      });
  }, []);

  if (loadingGameData) {
    return (
      <Stack
        direction={'column'}
        height={'100%'}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography>Loading game data...</Typography>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box overflow={'auto'} height={'100%'} width={'100%'}>
      <Stack direction={'row'} height={'inherit'}>
        <Box overflow={'auto'} height={'100%'} width={'100%'}>
          {isAvailable ? (
            children
          ) : (
            <Stack
              direction={'column'}
              rowGap={2}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              width={'100%'}
            >
              <Typography>Loading...</Typography>
              <CircularProgress />
            </Stack>
          )}
        </Box>
        <Stack
          direction={'column'}
          overflow={'auto'}
          height={'100%'}
          width={250}
          borderLeft={(t) => `1px solid ${t.palette.divider}`}
        >
          <SummonerInfo
            onClick={(summonerId) => profileModal.current?.open(summonerId)}
          />
          <Divider />
          chat
        </Stack>
      </Stack>
      <ProfileModal ref={profileModal} />
    </Box>
  );
};
