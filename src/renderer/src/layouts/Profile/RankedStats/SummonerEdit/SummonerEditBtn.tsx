import { Box } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import {
  SummonerEditModal,
  SummonerEditModalRef,
} from '@render/layouts/Profile/RankedStats/SummonerEdit/SummonerEditModal';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { useRef } from 'react';
import { FaPen } from 'react-icons/fa6';

interface SummonerEditProps {
  summonerId: number;
}

export const SummonerEditBtn = ({ summonerId }: SummonerEditProps) => {
  const currentSummoner = currentSummonerStore.info.use();

  const modalRef = useRef<SummonerEditModalRef>(null);

  if (!currentSummoner || currentSummoner?.summonerId !== summonerId) {
    return null;
  }

  return (
    <Box
      position={'absolute'}
      top={4}
      right={4}
      borderRadius={'50%'}
      bgcolor={'var(--mui-palette-primary-main)'}
    >
      <CustomIconButton
        color={'inherit'}
        onClick={() => modalRef.current?.open()}
      >
        <FaPen size={14} />
      </CustomIconButton>
      <SummonerEditModal ref={modalRef} />
    </Box>
  );
};
