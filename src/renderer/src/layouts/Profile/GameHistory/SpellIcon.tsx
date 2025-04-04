import { Avatar } from '@mui/material';

interface SpellIconProps {
  src: string;
}

export const SpellIcon = ({ src }: SpellIconProps) => {
  const size = 20;
  return (
    <Avatar variant={'square'} src={src} sx={{ height: size, width: size }} />
  );
};
