import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { RuneEdit } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RuneEdit';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface RuneEditModalRef {
  open: (pageRuneId: number) => void;
}

export const RuneEditModal = forwardRef<RuneEditModalRef>((_, ref) => {
  const [modalData, setModalData] = useState({
    open: false,
    pageRuneId: -1,
  });

  const handleCloseModal = () => {
    setModalData((prev) => ({ ...prev, open: false }));
  };

  useImperativeHandle(ref, () => {
    return {
      open: (pageRuneId) => {
        setModalData({
          open: true,
          pageRuneId,
        });
      },
    };
  }, []);

  return (
    <CustomDialog
      open={modalData.open}
      fullWidth
      maxWidth={'md'}
      hiddenBtnConfirm
      className={'theme-dark'}
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
          height: '80vh',
        },
      }}
      actionsComponent={<div />}
    >
      <CustomDialogCloseFloatingButton handleClose={handleCloseModal} />
      <RuneEdit pageRuneId={modalData.pageRuneId} />
    </CustomDialog>
  );
});
