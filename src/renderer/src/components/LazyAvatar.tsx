import {
  Avatar,
  AvatarOwnProps,
  Skeleton,
  SkeletonOwnProps,
} from '@mui/material';

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
  const getGrayScaleValue = () => {
    if (grayScale === undefined) return 0;
    if (typeof grayScale === 'boolean') return grayScale ? 1 : 0;
    return grayScale;
  };

  const parse: Record<
    NonNullable<AvatarOwnProps['variant']>,
    SkeletonOwnProps['variant']
  > = {
    circular: 'circular',
    rounded: 'rounded',
    square: 'rectangular',
  };
  if (!src) {
    return (
      <Skeleton
        variant={variant ? parse[variant] : 'rectangular'}
        width={size}
        height={size}
        animation={'wave'}
      />
    );
  }

  return (
    <Avatar
      variant={variant}
      src={src}
      slotProps={{
        img: {
          loading: 'lazy',
        },
      }}
      sx={{
        height: size,
        width: size,
        filter: `grayscale(${getGrayScaleValue()})`,
        background: 'transparent',
      }}
    >
      <Skeleton
        variant={variant ? parse[variant] : 'rectangular'}
        width={size}
        height={size}
        animation={'wave'}
      />
    </Avatar>
  );
};
