import { useLazyImage } from '@render/hooks/useLazyImage';
import { Avatar, Box, AvatarOwnProps } from '@mui/material';

export interface LazyAvatarProps {
  src: string;
  size?: number;
  grayScale?: boolean;
  variant: AvatarOwnProps['variant'];
}

export const LazyAvatar = ({
  src,
  size = 40,
  grayScale,
  variant,
}: LazyAvatarProps) => {
  const { isVisible, containerRef } = useLazyImage();

  if (!src) {
    return <Box height={size} width={size} />;
  }

  return (
    <Avatar
      ref={containerRef}
      variant={variant}
      src={isVisible ? src : ''}
      sx={{
        height: size,
        width: size,
        filter: `grayscale(${grayScale ? 1 : 0})`,
        background: 'transparent',
      }}
    >
      <div />
    </Avatar>
  );
};
