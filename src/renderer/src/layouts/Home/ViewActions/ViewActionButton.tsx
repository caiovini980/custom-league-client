import { Badge, Box, Grow, Portal } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { createContext, ReactElement, useContext, useState } from 'react';
import { IconType } from 'react-icons';

interface ViewActionButtonContext {
  forceOpen: () => void;
  forceClose: () => void;
  setBadge: (value: number) => void;
  isActive: boolean;
}

export interface ViewActionButtonProps {
  icon: IconType;
  active: boolean;
  onClick: (active: boolean) => void;
  component: ReactElement;
}

const Context = createContext({} as ViewActionButtonContext);

export const useViewActionButtonContext = () => useContext(Context);

export const ViewActionButton = ({
  icon: Icon,
  active,
  onClick,
  component,
}: ViewActionButtonProps) => {
  const [badge, setBadge] = useState(0);

  return (
    <Context.Provider
      value={{
        setBadge,
        forceOpen: () => onClick(true),
        forceClose: () => onClick(false),
        isActive: active,
      }}
    >
      <CustomIconButton
        onClick={() => onClick(!active)}
        sx={{
          background: active ? 'var(--mui-palette-primary-main)' : undefined,
        }}
      >
        <Icon />
        <Badge
          badgeContent={badge}
          color={'secondary'}
          sx={{ top: -10, right: -2 }}
        />
      </CustomIconButton>
      {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
      <Portal container={() => document.getElementById('view-container')!}>
        <Grow in={active}>
          <Box
            display={'flex'}
            position={'absolute'}
            bottom={0}
            right={0}
            zIndex={'var(--mui-zIndex-modal)'}
          >
            {component}
          </Box>
        </Grow>
      </Portal>
    </Context.Provider>
  );
};
