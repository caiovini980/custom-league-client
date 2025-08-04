import { Box, Stack, Typography } from '@mui/material';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { Null } from '@shared/typings/generic.typing';
import {
  Action,
  LolActivityCenterV1Content_IdBladeItem,
} from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';
import { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { PiFrameCornersBold } from 'react-icons/pi';

interface NewsActions {
  item: LolActivityCenterV1Content_IdBladeItem;
}

export const NewsActions = ({ item }: NewsActions) => {
  const [linkToOpen, setLinkToOpen] = useState<{
    open: boolean;
    action: Null<Action>;
  }>({
    open: false,
    action: null,
  });

  const closeModal = () => {
    setLinkToOpen((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const onClickAction = (action: Action) => {
    if (action.type === 'open_iframe') {
      setLinkToOpen({
        open: true,
        action: action,
      });
    }
    if (action.type === 'weblink' && action.payload.url) {
      window.electron.openExternal(action.payload.url);
    }
  };

  const getIconByActionType = (type: string) => {
    if (type === 'weblink') {
      return <FaExternalLinkAlt />;
    }
    if (type === 'open_iframe') {
      return <PiFrameCornersBold />;
    }
    return null;
  };

  return (
    <Stack
      direction={'column'}
      position={'absolute'}
      right={10}
      rowGap={0.5}
      overflow={'auto'}
      height={'100%'}
      py={2}
    >
      {item.header.links
        .filter((link) => link.displayType === 'media')
        .map((link, i) => {
          const isClickable = ['open_iframe', 'weblink'].includes(
            link.action.type,
          );
          return (
            <Stack
              key={i}
              height={100}
              width={180}
              justifyContent={'flex-end'}
              flexShrink={0}
              position={'relative'}
              onClick={() => {
                if (isClickable) {
                  onClickAction(link.action);
                }
              }}
              sx={{
                cursor: isClickable ? 'pointer' : undefined,
                background: `linear-gradient(0deg, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0) 40%), url(${link.media?.url})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              <Box position={'absolute'} top={5} right={5}>
                {getIconByActionType(link.action.type)}
              </Box>
              <Typography fontSize={'0.8rem'}>{link.title}</Typography>
            </Stack>
          );
        })}
      <CustomDialog
        open={linkToOpen.open}
        fullWidth
        maxWidth={'lg'}
        actionsComponent={<div />}
        dialogContentProps={{
          sx: {
            display: 'flex',
            height: '80vh',
            p: 0,
          },
        }}
      >
        <CustomDialogCloseFloatingButton handleClose={closeModal} />
        <LinkContent action={linkToOpen.action} />
      </CustomDialog>
    </Stack>
  );
};

const LinkContent = ({ action }: { action: Null<Action> }) => {
  if (!action) return null;

  if (action.type === 'open_iframe') {
    return (
      <Box
        component={'iframe'}
        src={action.payload.url}
        sx={{
          p: 0,
          border: 0,
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return null;
};
