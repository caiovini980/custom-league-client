import { Avatar } from '@mui/material';

interface ItemIconProps {
  src: string;
}

export const ItemIcon = ({ src }: ItemIconProps) => {
  const size = 24;
  return (
    <Avatar variant={'square'} src={src} sx={{ height: size, width: size }} />
  );
};
