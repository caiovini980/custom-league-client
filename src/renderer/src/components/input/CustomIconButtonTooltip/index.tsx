import { Tooltip, TooltipProps } from '@mui/material';
import { IconType } from 'react-icons';
import CustomIconButton, { CustomIconButtonProps } from '../CustomIconButton';

export interface CustomIconButtonTooltipProps extends CustomIconButtonProps {
  icon: IconType;
  onClick: (e?: unknown) => void;
  title: string;
  placement?: TooltipProps['placement'];
  open?: boolean;
  arrow?: boolean;
}

const CustomIconButtonTooltip = ({
  icon,
  onClick,
  open,
  placement = 'top',
  title,
  arrow = true,
  ...iconProps
}: CustomIconButtonTooltipProps) => {
  return (
    <Tooltip title={title} open={open} placement={placement} arrow={arrow}>
      <span>
        <CustomIconButton icon={icon} onClick={onClick} {...iconProps} />
      </span>
    </Tooltip>
  );
};

export default CustomIconButtonTooltip;
