import { ClickAwayListener, Tooltip, TooltipProps } from '@mui/material';
import CustomIconButton, { CustomIconButtonProps } from '../CustomIconButton';
import { ReactNode, useState } from 'react';

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
        <span>
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
        </span>
      </ClickAwayListener>
    );
  }

  return (
    <Tooltip {...tooltipProps}>
      <span>
        <CustomIconButton {...iconProps} />
      </span>
    </Tooltip>
  );
};

export default CustomIconButtonTooltip;
