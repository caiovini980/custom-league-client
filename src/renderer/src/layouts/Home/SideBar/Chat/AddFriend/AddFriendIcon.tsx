import { CustomIconButton } from '@render/components/input';
import { AddFriendModal } from '@render/layouts/Home/SideBar/Chat/AddFriend/AddFriendModal';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa6';

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
