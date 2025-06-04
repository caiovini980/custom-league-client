import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Null } from '@shared/typings/generic.typing';
import { SyntheticEvent } from 'react';
import { FaGamepad, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '@render/utils/config.util';
import { FaHome } from 'react-icons/fa';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';

export const BottomMenu = () => {
  const { localTranslate } = useLocalTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (_event: Null<SyntheticEvent>, newValue: string) => {
    navigate(`/${newValue}`);
  };

  const menus = [
    {
      id: '3ee462ea-d40d-435f-abfc-00a841474447',
      icon: FaHome,
      path: '',
      title: localTranslate('home_menu_button'),
    },
    {
      id: '12e5cc37-a2bd-4b3d-88c3-beeeee1c4707',
      icon: FaGamepad,
      path: 'lobby',
      title: localTranslate('lobby_menu_button'),
    },
    {
      id: '6bd77f91-70f7-45c0-b62c-60283e8f167a',
      icon: FaUser,
      path: 'profile',
      title: localTranslate('profile_menu_button'),
    },
  ];

  return (
    <BottomNavigation
      sx={{
        height: config.topBarHeight,
        backgroundColor: 'transparent',
        flexShrink: 0,
        overflow: 'hidden',
        zIndex: (t) => t.zIndex.fab,
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
      value={location.pathname.substring(1)}
      onChange={handleChange}
      showLabels
    >
      {menus.map((m) => (
        <BottomNavigationAction
          key={m.id}
          label={m.title}
          value={m.path}
          icon={<m.icon />}
        />
      ))}
    </BottomNavigation>
  );
};
