import { CustomIconButton } from '@render/components/input';
import { FaUserPlus } from 'react-icons/fa6';
import { useState } from 'react';
import { AddFriendModal } from '@render/layouts/Home/Chat/AddFriend/AddFriendModal';

export const AddFriendIcon = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <CustomIconButton onClick={() => setOpenModal(true)} sx={{ p: 1 }}>
        <FaUserPlus size={14} />
      </CustomIconButton>
      <AddFriendModal
        openModal={openModal}
        onCloseModal={() => setOpenModal(false)}
      />
    </>
  );
};
