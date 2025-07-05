import CustomDialog from '@render/components/CustomDialog';
import { CustomIconButton } from '@render/components/input';
import { ProfileView } from '@render/layouts/Profile/ProfileView';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export interface ProfileModalRef {
  open: (summonerId: number) => void;
  openWithGameNameAndTag: (gameName: string, tag: string) => void;
}

export const ProfileModal = forwardRef<ProfileModalRef>((_props, ref) => {
  const { makeRequest } = useLeagueClientRequest();
  const { snackError } = useSnackNotification();
  const { rcpFeLolPostgame } = useLeagueTranslate();
  const [modalData, setModalData] = useState({
    open: false,
    summonerId: -1,
    loading: false,
  });

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;

  useImperativeHandle(
    ref,
    () => {
      return {
        open: (summonerId: number) => {
          setModalData({ open: true, summonerId, loading: false });
        },
        openWithGameNameAndTag: async (gameName, tag) => {
          setModalData({ open: true, summonerId: -1, loading: true });

          const error = () => {
            setModalData({ open: false, summonerId: -1, loading: false });
            snackError(rcpFeLolPostgameTrans('postgame_view_profile_error'));
          };

          const lookupProfile = await makeRequest(
            'GET',
            buildEventUrl(
              '/lol-summoner/v1/alias/lookup?gameName={string}&tagLine={string}',
              encodeURIComponent(gameName),
              tag,
            ),
            undefined,
          );
          if (!lookupProfile.ok) {
            error();
            return;
          }
          const sum = await makeRequest(
            'GET',
            buildEventUrl(
              '/lol-summoner/v2/summoners/puuid/{uuid}',
              lookupProfile.body.puuid,
            ),
            undefined,
          );
          if (!sum.ok) {
            error();
            return;
          }
          setModalData({
            open: true,
            summonerId: sum.body.summonerId,
            loading: false,
          });
        },
      };
    },
    [],
  );

  const onCloseModal = () => {
    setModalData((prev) => ({ ...prev, open: false }));
  };

  return (
    <CustomDialog
      open={modalData.open}
      loading={modalData.loading}
      maxWidth={'xl'}
      fullWidth
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
          height: '80vh',
        },
      }}
      actionsComponent={<div />}
    >
      <CustomIconButton
        onClick={onCloseModal}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        <FaTimes size={20} />
      </CustomIconButton>
      <ProfileView summonerId={modalData.summonerId} />
    </CustomDialog>
  );
});
