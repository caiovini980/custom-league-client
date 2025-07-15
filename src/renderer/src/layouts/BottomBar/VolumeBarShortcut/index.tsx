import { Box } from '@mui/material';
import { CustomIconButtonTooltip } from '@render/components/input';
import { withClientConnected } from '@render/hoc/withClientConnected';
import { VolumeBar } from '@render/layouts/BottomBar/VolumeBar';
import { FaVolumeHigh } from 'react-icons/fa6';

export const VolumeBarShortcut = withClientConnected(() => {
  return (
    <CustomIconButtonTooltip
      title={
        <Box width={200} pr={2}>
          <VolumeBar />
        </Box>
      }
      openTooltipOnClick
    >
      <FaVolumeHigh />
    </CustomIconButtonTooltip>
  );
});
