import CustomDialog from '@render/components/CustomDialog';
import { CustomIconButton } from '@render/components/input';
import { ProfileView } from '@render/layouts/Profile/ProfileView';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

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
          top: 8,
          right: 8,
        }}
      >
        <FaTimes size={20} />
      </CustomIconButton>
      <ProfileView summonerId={modalData.summonerId} />
    </CustomDialog>
  );
});
