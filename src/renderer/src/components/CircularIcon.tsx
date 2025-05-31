import { LazyAvatar, LazyAvatarProps } from '@render/components/LazyAvatar';

interface CircularIconProps extends Omit<LazyAvatarProps, 'variant'> {}

export const CircularIcon = (props: CircularIconProps) => {
  return <LazyAvatar variant={'circular'} {...props} />;
};
