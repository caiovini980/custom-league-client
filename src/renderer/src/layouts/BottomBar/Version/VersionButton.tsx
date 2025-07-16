import { CustomButton } from '@render/components/input';
import { useVersionContext } from '@render/layouts/BottomBar/Version/VersionContext';
import { Stack, Typography } from '@mui/material';
import { MdDownload, MdDownloadDone } from 'react-icons/md';

export const VersionButton = () => {
  const { updateStatus, progress, versionInfo, openModal } =
    useVersionContext();

  const endIcon = () => {
    if (updateStatus === 'downloading') {
      return (
        <Stack direction={'row'} columnGap={0.5} alignItems={'center'}>
          <MdDownload />
          <Typography>{progress.percent}%</Typography>
        </Stack>
      );
    }
    if (updateStatus === 'available') {
      return (
        <Stack direction={'row'} columnGap={0.5} alignItems={'center'}>
          <MdDownloadDone />
          <Typography>100%</Typography>
        </Stack>
      );
    }
    return null;
  };

  if (!versionInfo) return null;

  return (
    <CustomButton
      color={'inherit'}
      onClick={openModal}
      endIcon={endIcon()}
      loading={updateStatus === 'checking'}
    >
      v{versionInfo.version}
    </CustomButton>
  );
};
