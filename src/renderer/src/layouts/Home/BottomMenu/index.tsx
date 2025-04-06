import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Null } from '@shared/typings/generic.typing';
import { SyntheticEvent } from 'react';
import { FaGamepad, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (_event: Null<SyntheticEvent>, newValue: string) => {
    navigate(`/${newValue}`);
  };

  const menus = [
    {
      id: '12e5cc37-a2bd-4b3d-88c3-beeeee1c4707',
      icon: FaGamepad,
      path: '',
      title: 'Lobby',
    },
    {
      id: '6bd77f91-70f7-45c0-b62c-60283e8f167a',
      icon: FaUser,
      path: 'profile',
      title: 'Profile',
    },
  ];

  return (
    <BottomNavigation
      sx={{ borderRadius: 8, overflow: 'hidden', zIndex: (t) => t.zIndex.fab }}
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
