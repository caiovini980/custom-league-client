import { Avatar, AvatarOwnProps, Box } from '@mui/material';
import { useLazyImage } from '@render/hooks/useLazyImage';

export interface LazyAvatarProps {
  src: string;
  size?: number;
  grayScale?: boolean | number;
  variant: AvatarOwnProps['variant'];
}

export const LazyAvatar = ({
  src,
  size = 40,
  grayScale,
  variant,
}: LazyAvatarProps) => {
  const { isVisible, containerRef } = useLazyImage();

  const getGrayScaleValue = () => {
    if (grayScale === undefined) return 0;
    if (typeof grayScale === 'boolean') return grayScale ? 1 : 0;
    return grayScale;
  };

  if (!src) {
    return <Box height={size} width={size} />;
  }

  return (
    <Avatar
      ref={containerRef}
      variant={variant}
      src={isVisible ? src : undefined}
      sx={{
        height: size,
        width: size,
        filter: `grayscale(${getGrayScaleValue()})`,
        background: 'transparent',
      }}
    >
      <div />
    </Avatar>
  );
};
