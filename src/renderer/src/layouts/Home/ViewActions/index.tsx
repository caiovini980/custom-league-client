import { Stack } from '@mui/material';
import { Conversations } from '@render/layouts/Home/ViewActions/Conversations';
import { Notifications } from '@render/layouts/Home/ViewActions/Notifications';
import { useState } from 'react';
import { MdChat, MdNotifications, MdTask } from 'react-icons/md';
import { ViewActionButton, ViewActionButtonProps } from './ViewActionButton';
import { Missions } from '@render/layouts/Home/ViewActions/Missions';

interface Actions extends Pick<ViewActionButtonProps, 'icon' | 'component'> {
  name: string;
  hidden?: boolean;
}

export const ViewActions = () => {
  const [viewActive, setViewActive] = useState('');

  const onChange = (name: string) => {
    return (active: boolean) => setViewActive(active ? name : '');
  };

  const actions: Actions[] = [
    {
      name: 'conversations',
      component: <Conversations />,
      icon: MdChat,
    },
    {
      icon: MdTask,
      name: 'missions',
      component: <Missions />,
    },
    {
      hidden: true,
      name: 'notification',
      component: <Notifications />,
      icon: MdNotifications,
    },
  ];

  return (
    <Stack
      direction={'row'}
      sx={{
        borderTop: '1px solid var(--mui-palette-divider)',
        '& button': {
          width: 40,
          height: 40,
          borderRadius: 0,
          border: '1px solid var(--mui-palette-divider)',
        },
      }}
    >
      {actions
        .filter((a) => !a.hidden)
        .map((action) => {
          return (
            <ViewActionButton
              key={action.name}
              component={action.component}
              icon={action.icon}
              active={viewActive === action.name}
              onClick={onChange(action.name)}
            />
          );
        })}
    </Stack>
  );
};
