import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Null } from '@shared/typings/generic.typing';
import { SyntheticEvent, useState } from 'react';
import { FaGamepad, FaStore, FaTags, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '@render/utils/config.util';
import { FaHome } from 'react-icons/fa';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { LolYourShopV1Status } from '@shared/typings/lol/response/lolYourShopV1Status';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { Wallet } from '@render/layouts/Home/AppMenu/Wallet';
import { useAudioManager } from '@render/hooks/useAudioManager';

export const AppMenu = () => {
  const { rcpFeLolL10n } = useLeagueTranslate();
  const { play } = useAudioManager();
  const navigate = useNavigate();
  const location = useLocation();

  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const [yourShopStatus, setYourShopStatus] = useState<LolYourShopV1Status>();

  useLeagueClientEvent('/lol-yourshop/v1/status', (data) => {
    setYourShopStatus(data);
  });

  const handleChange = (_event: Null<SyntheticEvent>, newValue: string) => {
    play('tab_change');
    navigate(`/${newValue}`);
  };

  const menus = [
    {
      icon: FaHome,
      path: '',
      title: rcpFeLolL10nTrans('navbar_home'),
      hidden: false,
    },
    {
      icon: FaGamepad,
      path: 'lobby',
      title: rcpFeLolL10nTrans('navbar_button_play'),
    },
    {
      icon: FaUser,
      path: 'profile',
      title: rcpFeLolL10nTrans('navbar_profile'),
    },
    {
      icon: FaStore,
      path: 'store',
      title: rcpFeLolL10nTrans('navbar_store'),
      hidden: true,
    },
    {
      icon: FaTags,
      path: 'yourshop',
      title: rcpFeLolL10nTrans('navbar_yourshop'),
      hidden: !yourShopStatus?.hubEnabled,
    },
  ];

  return (
    <BottomNavigation
      sx={{
        position: 'relative',
        height: config.topBarHeight,
        backgroundColor: 'transparent',
        flexShrink: 0,
        overflow: 'hidden',
        zIndex: (t) => t.zIndex.fab,
        borderBottom: '1px solid var(--mui-palette-divider)',
      }}
      value={location.pathname.substring(1)}
      onChange={handleChange}
      showLabels
    >
      {menus
        .filter((m) => !m.hidden)
        .map((m) => (
          <BottomNavigationAction
            key={m.path}
            label={m.title}
            value={m.path}
            icon={<m.icon />}
            sx={{ maxWidth: 'fit-content' }}
          />
        ))}
      <Box position={'absolute'} right={0} top={0} height={'100%'}>
        <Wallet />
      </Box>
    </BottomNavigation>
  );
};
