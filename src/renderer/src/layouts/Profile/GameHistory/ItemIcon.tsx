import { Avatar, Box } from '@mui/material';

interface ItemIconProps {
  src: string;
}

export const ItemIcon = ({ src }: ItemIconProps) => {
  const size = 28;
  if (!src) {
    return <Box height={size} width={size} />;
  }
  return (
    <Avatar variant={'square'} src={src} sx={{ height: size, width: size }} />
  );
};
