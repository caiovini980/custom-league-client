import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomIconButton } from '@render/components/input';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { ReactElement, useRef } from 'react';

interface FriendCardItemProps {
  summonerId: number;
  gameName: string;
  tagLine: string;
  iconSrc: string;
  onClickAction: () => void;
  iconAction: ReactElement;
}

export const FriendCardItem = ({
  summonerId,
  gameName,
  tagLine,
  iconSrc,
  onClickAction,
  iconAction,
}: FriendCardItemProps) => {
  const profileModalRef = useRef<ProfileModalRef>(null);

  return (
    <Stack direction={'row'} alignItems={'center'} columnGap={0.5}>
      <CustomIconButton
        sx={{ p: 0.6 }}
        onClick={() =>
          summonerId
            ? profileModalRef.current?.open(summonerId)
            : profileModalRef.current?.openWithGameNameAndTag(gameName, tagLine)
        }
      >
        <CircularIcon src={iconSrc} size={26} />
      </CustomIconButton>
      <Typography>{gameName}</Typography>
      <Typography color={'textDisabled'} fontSize={'0.8rem'}>
        #{tagLine}
      </Typography>
      <CustomIconButton onClick={() => onClickAction()} sx={{ p: 0.6 }}>
        {iconAction}
      </CustomIconButton>
      <ProfileModal ref={profileModalRef} />
    </Stack>
  );
};
