import { CircularIcon } from '@render/components/CircularIcon';
import { CustomIconButton } from '@render/components/input';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { useRef } from 'react';

interface SummonerIconProfileProps {
  profileIconId: number;
  iconSize?: number;
  summonerId: number;
  disabled?: boolean;
  overrideImg?: string;
}

export const SummonerIconProfile = ({
  profileIconId,
  summonerId,
  iconSize = 30,
  disabled = false,
  overrideImg,
}: SummonerIconProfileProps) => {
  const { profileIcon } = useLeagueImage();

  const profileRef = useRef<ProfileModalRef>(null);

  return (
    <>
      <CustomIconButton
        disabled={disabled}
        onClick={() => profileRef.current?.open(summonerId)}
        sx={{ p: 0.3 }}
      >
        <CircularIcon
          src={overrideImg ?? profileIcon(profileIconId)}
          size={iconSize}
        />
      </CustomIconButton>
      <ProfileModal ref={profileRef} />
    </>
  );
};
