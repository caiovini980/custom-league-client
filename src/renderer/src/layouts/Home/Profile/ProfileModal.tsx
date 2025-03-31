import CustomDialog from '@render/components/CustomDialog';
import { ProfileView } from '@render/layouts/Home/Profile/ProfileView';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface ProfileModalRef {
  open: (summonerId: number) => void;
}

export const ProfileModal = forwardRef<ProfileModalRef>((_props, ref) => {
  const [modalData, setModalData] = useState({ open: false, summonerId: -1 });

  useImperativeHandle(
    ref,
    () => {
      return {
        open: (summonerId: number) => {
          setModalData({ open: true, summonerId });
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
      handleClose={onCloseModal}
      hiddenBtnConfirm
      labelBtnCancel={'Close'}
      maxWidth={'sm'}
      fullWidth
    >
      <ProfileView summonerId={modalData.summonerId} />
    </CustomDialog>
  );
});
