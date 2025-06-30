import { CustomIconButtonTooltip } from '@render/components/input';
import { FaVolumeHigh } from 'react-icons/fa6';
import { VolumeBar } from '@render/layouts/BottomBar/VolumeBar';
import { Box } from '@mui/material';
import { withClientConnected } from '@render/hoc/withClientConnected';

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
