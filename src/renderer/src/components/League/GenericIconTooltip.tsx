import { Stack, Tooltip, TooltipProps } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

interface GenericIconTooltipProps {
  src: string;
  value: string | number;
  size?: number;
  placement?: TooltipProps['placement'];
}

export const GenericIconTooltip = ({
  size,
  src,
  value,
  placement,
}: GenericIconTooltipProps) => {
  const { genericImg } = useLeagueImage();

  return (
    <Tooltip title={value} placement={placement} arrow disableInteractive>
      <Stack alignItems={'center'}>
        <CircularIcon src={genericImg(src)} size={size} />
      </Stack>
    </Tooltip>
  );
};
