import { LazyAvatar, LazyAvatarProps } from '@render/components/LazyAvatar';

interface SquareIconProps extends Omit<LazyAvatarProps, 'variant'> {}

export const SquareIcon = (props: SquareIconProps) => {
  return <LazyAvatar variant={'square'} {...props} />;
};
