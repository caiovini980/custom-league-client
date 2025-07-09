import { Box, ClickAwayListener, Tooltip, TooltipProps } from '@mui/material';
import { ReactNode, useState } from 'react';
import CustomIconButton, { CustomIconButtonProps } from '../CustomIconButton';

export interface CustomIconButtonTooltipProps
  extends Omit<CustomIconButtonProps, 'title'> {
  title: ReactNode;
  placement?: TooltipProps['placement'];
  arrow?: boolean;
  openTooltipOnClick?: boolean;
  disableInteractive?: boolean;
}

const CustomIconButtonTooltip = ({
  placement = 'top',
  title,
  arrow = true,
  openTooltipOnClick = false,
  disableInteractive = false,
  ...iconProps
}: CustomIconButtonTooltipProps) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleCloseTooltip = () => setOpenTooltip(false);
  const toggleTooltip = () => setOpenTooltip((p) => !p);

  const tooltipProps: Omit<TooltipProps, 'children'> = {
    title,
    arrow,
    placement,
    disableInteractive,
  };

  if (openTooltipOnClick) {
    return (
      <ClickAwayListener onClickAway={handleCloseTooltip}>
        <Box component={'span'} display={'flex'}>
          <Tooltip
            open={openTooltip}
            onClose={handleCloseTooltip}
            disableFocusListener
            disableTouchListener
            disableHoverListener
            {...tooltipProps}
          >
            <CustomIconButton {...iconProps} onClick={toggleTooltip} />
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  }

  return (
    <Tooltip {...tooltipProps}>
      <Box component={'span'} display={'flex'}>
        <CustomIconButton {...iconProps} />
      </Box>
    </Tooltip>
  );
};

export default CustomIconButtonTooltip;
